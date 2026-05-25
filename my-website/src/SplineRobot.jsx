// import Spline from '@splinetool/react-spline';
// import { useMemo } from 'react';

// export default function SplineRobot() {
//   // Cache-bust so we always pull the latest export
//   const sceneUrl = useMemo(
//     () => `https://prod.spline.design/ANQ2oDIG0IimKHju/scene.splinecode?uid=${Math.random()}`,
//     []
//   );

//   return (
//     <div className="TrackingRobot">
//       <Spline
//         scene={sceneUrl}
//         className="spline-embed"
//         style={{ width: '100%', height: '100%' }}
//       />
//     </div>
//   );
// }

import Spline from '@splinetool/react-spline';

export default function App() {
  return (
    <Spline scene="https://prod.spline.design/ANQ2oDIG0IimKHju/scene.splinecode" />
  );
}
