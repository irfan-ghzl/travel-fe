import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center text-center">
        <section className="flex flex-col items-center gap-6 flex-grow">
          <div className="flex gap-8 justify-center">
            <a href="https://vite.dev" target="_blank" rel="noreferrer">
              <img src={viteLogo} className="h-24 p-4 transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">
              <img src={reactLogo} className="h-24 p-4 transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-spin [animation-duration:20s]" alt="React logo" />
            </a>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white lg:text-6xl">
            Vite + React
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Edit <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200">src/App.tsx</code> and save to test HMR
          </p>
          <div className="mt-4">
            <button
              className="rounded-lg border-2 border-transparent bg-purple-100 dark:bg-purple-900/30 px-5 py-2.5 text-purple-600 dark:text-purple-400 font-mono text-base transition-colors hover:border-purple-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 cursor-pointer"
              onClick={() => setCount((count) => count + 1)}
            >
              Count is {count}
            </button>
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              📚 Documentation
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Your questions, answered</p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://vite.dev/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors no-underline"
              >
                <img className="h-4" src={viteLogo} alt="" />
                Explore Vite
              </a>
              <a
                href="https://react.dev/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors no-underline"
              >
                <img className="h-4" src={reactLogo} alt="" />
                Learn React
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              🔗 Connect
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Join the Vite community</p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://github.com/vitejs/vite"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors no-underline"
              >
                GitHub
              </a>
              <a
                href="https://chat.vite.dev/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors no-underline"
              >
                Discord
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
