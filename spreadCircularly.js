export const spreadInCircle = async () => {
  let selectedWidgets = await miro.board.selection.get();
  if (selectedWidgets.length == 0) {
    miro.showNotification("Select atleast one sticker, shape or text");
    return;
  }

  const selectionBoundingBox = getSelectionBoundingBox(selectedWidgets);
  const centerCoordinate = getCenterCoordinate(selectionBoundingBox);

  const totalWidget = selectedWidgets.length;

  const radius = getRadius(selectionBoundingBox);
  const angle = (2 * Math.PI) / totalWidget;

  const updatedWidgets = _.map(selectedWidgets, (widget, index) => {
    const x = radius * Math.cos(angle * index) + centerCoordinate.x;
    const y = radius * Math.sin(angle * index) + centerCoordinate.y;

    return { ...widget, x, y };
  });
  const widgetIds = _.map(updatedWidgets, "id");

  await miro.board.widgets.update(updatedWidgets);
  await miro.board.viewport.zoomToObject(widgetIds);
};

const getCenterCoordinate = (boundingBox) => {
  const { left, right, bottom, top } = boundingBox;
  return { x: (right - left) / 2, y: (top - bottom) / 2 };
};

const getRadius = (boundingBox) => {
  const { height, width } = boundingBox;
  return _.max([height, width]) / 2;
};

const getSelectionBoundingBox = (selectedWidgets) => {
  const bottomValues = _.map(selectedWidgets, "bounds.bottom");
  const topValues = _.map(selectedWidgets, "bounds.top");
  const leftValues = _.map(selectedWidgets, "bounds.left");
  const rightValues = _.map(selectedWidgets, "bounds.right");

  const selectionBottomBound = _.max(bottomValues);
  const selectionTopBound = _.min(topValues);
  const selectionLeftBound = _.min(leftValues);
  const selectionRightBound = _.max(rightValues);

  return {
    top: selectionTopBound,
    bottom: selectionBottomBound,
    left: selectionLeftBound,
    right: selectionRightBound,
    height: Math.abs(selectionTopBound - selectionBottomBound),
    width: Math.abs(selectionLeftBound - selectionRightBound),
  };
};
