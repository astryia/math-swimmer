import { SettingsProvider } from '@/contexts/SettingsContext'
import { GameProvider, useGame } from '@/contexts/GameContext'
import HomeScreen from '@/screens/HomeScreen'
import SettingsScreen from '@/screens/SettingsScreen'
import GameScreen from '@/screens/GameScreen'
import ResultsScreen from '@/screens/ResultsScreen'

function AppInner() {
  const { state } = useGame()

  switch (state.screen) {
    case 'home':
      return <HomeScreen />
    case 'settings':
      return <SettingsScreen />
    case 'game':
      return <GameScreen />
    case 'results':
      return <ResultsScreen />
  }
}

export default function App() {
  return (
    <SettingsProvider>
      <GameProvider>
        <AppInner />
      </GameProvider>
    </SettingsProvider>
  )
}
