import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { PlayerDataContext, SocketContext } from '../../../App';

import mapImage from '../../../images/map.jpg';
import positionMapCoords from '../positions';
import pawnImages from '../../../constants/pawnImages';
import canPawnMove from './canPawnMove';
import getPositionAfterMove from './getPositionAfterMove';

const Map = ({ pawns, nowMoving, rolledNumber }) => {
    const player = useContext(PlayerDataContext);
    const socket = useContext(SocketContext);
    const canvasRef = useRef(null);

    const [hintPawn, setHintPawn] = useState();
    const [moveablePawns, setMoveablePawns] = useState([]);

    // Calculate which pawns can move when the rolledNumber changes
    useEffect(() => {
        if (rolledNumber && player.color) {
            const playerPawns = pawns.filter(pawn => pawn.color === player.color);
            const canMove = playerPawns.filter(pawn => canPawnMove(pawn, rolledNumber));
            setMoveablePawns(canMove.map(pawn => pawn._id));
        } else {
            setMoveablePawns([]);
        }
    }, [rolledNumber, pawns, player.color]);

    // Wrap paintPawn in useCallback to memoize it
    const paintPawn = useCallback((context, pawn, pawnIndex, pawnsAtSamePosition) => {
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
        
        // Check if this pawn can move
        const isMoveable = moveablePawns.includes(pawn._id) && 
                           player.color === pawn.color && 
                           nowMoving && 
                           rolledNumber !== null;
        
        // Draw highlight for moveable pawns
        if (isMoveable) {
            // Create a glow effect
            const glowRadius = pawnSize / 2 + 8;
            const gradient = context.createRadialGradient(
                x + offsetX, y + offsetY, pawnSize / 2,
                x + offsetX, y + offsetY, glowRadius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)'); // Yellow core
            gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');   // Transparent outer
            
            context.fillStyle = gradient;
            context.beginPath();
            context.arc(x + offsetX, y + offsetY, glowRadius, 0, Math.PI * 2);
            context.fill();
            
            // Add a pulsing animated border for extra visibility
            context.strokeStyle = 'rgba(255, 215, 0, 0.8)'; // Gold
            context.lineWidth = 2;
            context.beginPath();
            context.arc(x + offsetX, y + offsetY, pawnSize / 2 + 4, 0, Math.PI * 2);
            context.stroke();
        }
        
        const touchableArea = new Path2D();
        touchableArea.arc(x + offsetX, y + offsetY, pawnSize / 3, 0, 2 * Math.PI);
        
        const image = new Image();
        image.src = pawnImages[pawn.color];
        image.onload = function () {
            context.drawImage(image, x - pawnSize/2 + offsetX, y - pawnSize/2 + offsetY, pawnSize, pawnSize * 0.86);
        };
        
        return touchableArea;
    }, [moveablePawns, player.color, nowMoving, rolledNumber]);

    // Helper to check if click/touch is on a pawn and handle if needed
    const handleInteraction = (clientX, clientY) => {
        const canvas = canvasRef.current;
        if (!canvas) return false;
        
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        let pawnInteracted = false;
        
        for (const pawn of pawns) {
            if (ctx.isPointInPath(pawn.touchableArea, x, y)) {
                if (canPawnMove(pawn, rolledNumber)) {
                    socket.emit('game:move', pawn._id);
                    pawnInteracted = true;
                }
            }
        }
        
        setHintPawn(null);
        return pawnInteracted;
    };

    const handleCanvasClick = event => {
        event.preventDefault(); // Prevent default browser action
        handleInteraction(event.clientX, event.clientY);
    };
    
    // Handle touch events for mobile devices
    const handleTouchStart = event => {
        event.preventDefault(); // Prevent default browser action (zooming, scrolling)
        
        if (event.touches.length > 0) {
            const touch = event.touches[0];
            handleInteraction(touch.clientX, touch.clientY);
        }
    };

    const handleMouseMove = event => {
        if (!nowMoving || !rolledNumber) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect(),
            x = event.clientX - rect.left,
            y = event.clientY - rect.top;
        canvas.style.cursor = 'default';
        
        let onPawn = false;
        
        for (const pawn of pawns) {
            if (
                ctx.isPointInPath(pawn.touchableArea, x, y) &&
                player.color === pawn.color &&
                canPawnMove(pawn, rolledNumber)
            ) {
                onPawn = true;
                canvas.style.cursor = 'pointer';
                const pawnPosition = getPositionAfterMove(pawn, rolledNumber);
                if (pawnPosition) {
                    if (hintPawn && hintPawn.id === pawn._id) return;
                    setHintPawn({ id: pawn._id, position: pawnPosition, color: 'grey' });
                    return;
                }
            }
        }
        
        if (!onPawn) {
            setHintPawn(null);
        }
    };

    useEffect(() => {
        const rerenderCanvas = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.src = mapImage;
            image.onload = function () {
                ctx.drawImage(image, 0, 0);
                
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
    }, [hintPawn, pawns, paintPawn]);

    return (
        <div style={{ 
            touchAction: 'none', // Prevents browser handling of touch gestures
            WebkitTapHighlightColor: 'transparent', // Removes tap highlight on iOS
            WebkitTouchCallout: 'none', // Disables callout
            WebkitUserSelect: 'none', // Disables selection
            KhtmlUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none' // Disables selection across browsers
        }}>
            <canvas
                ref={canvasRef}
                width={460}
                height={460}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                style={{
                    WebkitTapHighlightColor: 'rgba(0,0,0,0)', // Removes tap highlight
                    outline: 'none', // Removes outline on focus
                    touchAction: 'none' // Disables browser handling of gestures
                }}
            />
        </div>
    );
};

export default Map;
