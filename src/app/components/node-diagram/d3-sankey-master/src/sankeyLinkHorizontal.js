import {linkHorizontal} from "d3-shape";

function horizontalSource(d) {
  return [(d.source.x0+2), d.y0];
}

function horizontalTarget(d) {
  return [(d.target.x0+2), d.y1];
}

export default function() {
  return linkHorizontal()
      .source(horizontalSource)
      .target(horizontalTarget);
}

