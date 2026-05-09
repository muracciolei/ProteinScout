import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Protein Scout crashed:', error, info)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200 flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold text-fuchsia-400">Something broke</h1>
          <p className="text-sm text-zinc-400 break-words">
            {this.state.error.message}
          </p>
          <button
            onClick={this.reset}
            className="px-4 py-2 rounded-md bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }
}
