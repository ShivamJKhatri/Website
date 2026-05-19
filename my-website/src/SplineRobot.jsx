import Spline from '@splinetool/react-spline';
import { useMemo } from 'react';

export default function SplineRobot() {
  // Cache-bust so we always pull the latest export
  const sceneUrl = useMemo(
    () => `https://prod.spline.design/sYLsnoXIW9cD7kYf/scene.splinecode?uid=${Math.random()}`,
    []
  );

  return (
    <div className="TrackingRobot">
      <Spline
        scene={sceneUrl}
        className="spline-embed"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

