import { Suspense, lazy } from 'react';

const HelloWorld = lazy(() => import('remote_app/HelloWorld'));
// const ChatZaloV2 = lazy(() => import("chatZaloV2/App"));

function App() {
  return (
    <div>
      <h1>This is Host App</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <HelloWorld />
      </Suspense>
      {/* <Suspense fallback={<div>Loading ChatZalo...</div>}>
        <ChatZaloV2 />
      </Suspense> */}
    </div>
  );
}

export default App;
