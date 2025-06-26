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

export const GifsSocketEvents = {
  LOAD_GIFS: 'gifs:load-gifs',
  ADD_GIF: 'gifs:add-gif',
  REMOVE_GIF: 'gifs:remove-gif',
  UPDATE_GIF: 'gifs:update-gif',
} as const;

export const BoardSocketEvents = {
  REMOVE_BOARD_ALL_CONTENT: 'board:remove-board-all-content',
} as const;

export const GlobalSocketEvents = {
  ERROR: 'global:error',
} as const;
