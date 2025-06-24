export type PreprSegment = {
  _id: string;
  name: string;
};

export type PreprPreviewBarOptions = {
  debug?: boolean;
  // Future options can be added here:
  // enableProximityHighlight?: boolean;
  // enableOverlay?: boolean;
  // enableTooltip?: boolean;
};

export type PreprPreviewBarProps = {
  activeSegment: string | null;
  activeVariant: string | null;
  data: PreprSegment[];
};
