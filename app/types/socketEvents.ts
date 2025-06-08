export const NotesSocketEvents = {
  GET_ALL: 'notes:get-all',
  ADD: 'notes:add',
  REMOVE: 'notes:remove',
  REMOVE_ALL: 'notes:remove-all',
  UPDATE: 'notes:update',
  RESTORE: 'notes:restore',
} as const;

export const DrawingSocketEvents = {
  LOAD_DRAWING: 'drawing:load-drawing',
  ADD_STROKE: 'drawing:add-stroke',
  REMOVE_STROKE: 'drawing:remove-stroke',
  REMOVE_ALL: 'drawing:remove-all',
  REMOVE_ALL_STROKES: 'drawing:remove-all-strokes',
  UNDO_CLEAR_ALL: 'drawing:undo_clear_all',
} as const;
