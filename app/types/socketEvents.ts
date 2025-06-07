export const NotesSocketEvents = {
  GET_ALL: 'notes:get-all',
  ADD: 'notes:add',
  REMOVE: 'notes:remove',
  REMOVE_ALL: 'notes:remove-all',
  UPDATE: 'notes:update',
  RESTORE: 'notes:restore',
} as const;

export const DrawingSocketEvents = {
  ADD_STROKE: 'drawing:add-stroke',
  REMOVE_STROKE: 'drawing:remove-stroke',
  REMOVE_ALL: 'drawing:remove-all',
  REMOVE_ALL_STROKES: 'drawing:remove-all-strokes',
} as const;
