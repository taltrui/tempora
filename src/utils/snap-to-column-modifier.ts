import type { Modifier, CollisionDetection } from '@dnd-kit/core';
import { pointerWithin, closestCenter } from '@dnd-kit/core';

export const snapToColumnModifier: Modifier = ({ transform, over, activeNodeRect }) => {
  if (!over || !activeNodeRect) return transform;

  return {
    ...transform,
    x: over.rect.left - activeNodeRect.left,
  };
};

export const columnCollisionDetection: CollisionDetection = (args) => {
  const columnEntries = args.droppableContainers.filter(
    (container) => typeof container.id === 'string' && container.id.startsWith('drop-column-'),
  );

  const columnOnly = { ...args, droppableContainers: columnEntries };

  const pointerCollisions = pointerWithin(columnOnly);
  if (pointerCollisions.length > 0) return pointerCollisions;

  return closestCenter(columnOnly);
};
