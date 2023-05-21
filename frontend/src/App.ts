import './App.css';

function App() {
  return (
    // @ts-expect-error TS(2304): Cannot find name 'div'.
    <div className="App">
      // @ts-expect-error TS(2552): Cannot find name 'header'. Did you mean 'Headers'?
      <header className="App-header">
// @ts-expect-error TS(2304): Cannot find name 'p'.
		<p>Hello</p>
      </header>
    </div>
  );
}

export default App;
