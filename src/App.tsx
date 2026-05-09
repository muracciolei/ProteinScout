import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-4 text-purple-400">Protein Scout</h1>
      <p className="text-xl mb-8">Explore the universe of proteins</p>
      <div className="space-x-4">
        <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded">Search Proteins</button>
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">3D Viewer</button>
        <a
          href="https://buymeacoffee.com/muracciolei"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded shadow-lg transition"
        >
          Support with Coffee
        </a>
      </div>
    </div>
  )
}

export default App