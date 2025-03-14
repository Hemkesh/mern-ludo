import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { PlayerDataContext, SocketContext } from '../../../App';

import mapImage from '../../../images/map.jpg';
import positionMapCoords from '../positions';
import pawnImages from '../../../constants/pawnImages';
import canPawnMove from './canPawnMove';
import getPositionAfterMove from './getPositionAfterMove';

// Safe zones for reference
const SAFE_ZONES = [29,42,55,16,63,24,37,50];

const Map = ({ pawns, nowMoving, rolledNumber }) => {
    const player = useContext(PlayerDataContext);
    const socket = useContext(SocketContext);
    const canvasRef = useRef(null);

    const [hintPawn, setHintPawn] = useState();
    const [showPositionNumbers, setShowPositionNumbers] = useState(true); // State to toggle position numbers

    // Draw position numbers on the board
    const drawPositionNumbers = useCallback((ctx) => {
        if (!showPositionNumbers) return;
        
        // Configure text appearance
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw numbers for each position
        positionMapCoords.forEach((pos, index) => {
            const isSafeZone = SAFE_ZONES.includes(index);
            
            // Skip drawing numbers for base positions (0-15)
            if (index < 16) return;
            
            // Set color: red for safe zones, white for others
            if (isSafeZone) {
                // Draw a background circle for safe zones
                ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; // semi-transparent yellow
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
                ctx.fill();
                
                ctx.fillStyle = 'red'; // Safe zone text in red
            } else {
                ctx.fillStyle = 'black'; // Regular position text in black
            }
            
            // Draw the position number
            ctx.fillText(index.toString(), pos.x, pos.y);
        });
    }, [showPositionNumbers]);

    // Toggle position numbers when T key is pressed
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 't' || e.key === 'T') {
                setShowPositionNumbers(prev => !prev);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const paintPawn = (context, pawn, pawnIndex, pawnsAtSamePosition) => {
        const { x, y } = positionMapCoords[pawn.position];
        
        // Calculate offset if multiple pawns on same position
        let offsetX = 0;
        let offsetY = 0;
        let pawnSize = 35; // Default pawn size
        
        if (pawnsAtSamePosition > 1) {
            // Make pawns smaller if multiple on same square
            pawnSize = Math.max(22, 35 - (pawnsAtSamePosition * 3));
            
            // Create a grid pattern for positioning:
            // 1 pawn: center
            // 2 pawns: side by side
            // 3 pawns: triangle
            // 4 pawns: 2x2 grid
            const offset = pawnSize / 2;
            
            if (pawnsAtSamePosition === 2) {
                // Two pawns side by side
                offsetX = pawnIndex === 0 ? -offset/2 : offset/2;
            } else if (pawnsAtSamePosition === 3) {
                // Triangle formation
                if (pawnIndex === 0) {
                    offsetY = -offset/2;
                } else if (pawnIndex === 1) {
                    offsetX = -offset/2;
                    offsetY = offset/2;
                } else {
                    offsetX = offset/2;
                    offsetY = offset/2;
                }
            } else if (pawnsAtSamePosition >= 4) {
                // 2x2 grid or more
                offsetX = (pawnIndex % 2 === 0) ? -offset/2 : offset/2;
                offsetY = (Math.floor(pawnIndex / 2) % 2 === 0) ? -offset/2 : offset/2;
            }
        }
        
        const touchableArea = new Path2D();
        touchableArea.arc(x + offsetX, y + offsetY, pawnSize / 3, 0, 2 * Math.PI);
        
        const image = new Image();
        image.src = pawnImages[pawn.color];
        image.onload = function () {
            context.drawImage(image, x - pawnSize/2 + offsetX, y - pawnSize/2 + offsetY, pawnSize, pawnSize * 0.86);
        };
        
        return touchableArea;
    };

    const handleCanvasClick = event => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect(),
            cursorX = event.clientX - rect.left,
            cursorY = event.clientY - rect.top;
        for (const pawn of pawns) {
            if (ctx.isPointInPath(pawn.touchableArea, cursorX, cursorY)) {
                if (canPawnMove(pawn, rolledNumber)) socket.emit('game:move', pawn._id);
            }
        }
        setHintPawn(null);
    };

    const handleMouseMove = event => {
        if (!nowMoving || !rolledNumber) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect(),
            x = event.clientX - rect.left,
            y = event.clientY - rect.top;
        canvas.style.cursor = 'default';
        for (const pawn of pawns) {
            if (
                ctx.isPointInPath(pawn.touchableArea, x, y) &&
                player.color === pawn.color &&
                canPawnMove(pawn, rolledNumber)
            ) {
                const pawnPosition = getPositionAfterMove(pawn, rolledNumber);
                if (pawnPosition) {
                    canvas.style.cursor = 'pointer';
                    if (hintPawn && hintPawn.id === pawn._id) return;
                    setHintPawn({ id: pawn._id, position: pawnPosition, color: 'grey' });
                    return;
                }
            }
        }
        setHintPawn(null);
    };

    useEffect(() => {
        const rerenderCanvas = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.src = mapImage;
            image.onload = function () {
                ctx.drawImage(image, 0, 0);
                
                // Draw position numbers after the map is drawn
                drawPositionNumbers(ctx);
                
                // Group pawns by position
                const positionMap = {};
                pawns.forEach(pawn => {
                    if (!positionMap[pawn.position]) {
                        positionMap[pawn.position] = [];
                    }
                    positionMap[pawn.position].push(pawn);
                });
                
                // Draw pawns with appropriate offsets based on how many share the position
                Object.values(positionMap).forEach(pawnsAtPosition => {
                    pawnsAtPosition.forEach((pawn, idx) => {
                        const pawnIndex = pawns.findIndex(p => p._id === pawn._id);
                        if (pawnIndex >= 0) {
                            pawns[pawnIndex].touchableArea = paintPawn(ctx, pawn, idx, pawnsAtPosition.length);
                        }
                    });
                });
                
                if (hintPawn) {
                    paintPawn(ctx, hintPawn, 0, 1);
                }
            };
        };
        rerenderCanvas();
    }, [hintPawn, pawns, drawPositionNumbers]);

    return (
        <div>
            <canvas
                className='canvas-container'
                width={460}
                height={460}
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
            />
            {showPositionNumbers && (
                <div style={{ 
                    position: 'absolute', 
                    bottom: '10px', 
                    right: '10px', 
                    background: 'rgba(0,0,0,0.7)', 
                    color: 'white', 
                    padding: '5px',
                    borderRadius: '5px',
                    fontSize: '12px'
                }}>
                    <div>Press 'T' to toggle position numbers</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ 
                            display: 'inline-block', 
                            width: '12px', 
                            height: '12px', 
                            background: 'rgba(255, 255, 0, 0.5)', 
                            marginRight: '5px' 
                        }}></span>
                        Safe Zones
                    </div>
                </div>
            )}
        </div>
    );
};
export default Map;
