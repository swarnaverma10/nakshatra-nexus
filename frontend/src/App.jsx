import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingScreen from './screens/LandingScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import SelfieScreen from './screens/SelfieScreen'
import ProcessingScreen from './screens/ProcessingScreen'
import AvatarScreen from './screens/AvatarScreen'
import CosmicBlueprintScreen from './screens/CosmicBlueprintScreen'
import CosmicIdentityScreen from './screens/CosmicIdentityScreen'
import CosmicWheelScreen from './screens/CosmicWheelScreen'
import PassportScreen from './screens/PassportScreen'
import QRScreen from './screens/QRScreen'
import EmailSentScreen from './screens/EmailSentScreen'
import DestinyVaultScreen from './screens/DestinyVaultScreen'
import JourneyCompleteScreen from './screens/JourneyCompleteScreen'
import VisitorProfileScreen from './screens/VisitorProfileScreen'
import NotFoundScreen from './screens/NotFoundScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/selfie" element={<SelfieScreen />} />
        <Route path="/processing" element={<ProcessingScreen />} />
        <Route path="/avatar" element={<AvatarScreen />} />
        <Route path="/cosmic-blueprint" element={<CosmicBlueprintScreen />} />
        <Route path="/cosmic-identity" element={<CosmicIdentityScreen />} />
        <Route path="/cosmic-wheel" element={<CosmicWheelScreen />} />
        <Route path="/destiny-vault" element={<DestinyVaultScreen />} />
        <Route path="/passport" element={<PassportScreen />} />
        <Route path="/qr" element={<QRScreen />} />
        <Route path="/email-sent" element={<EmailSentScreen />} />
        <Route path="/journey-complete" element={<JourneyCompleteScreen />} />
        <Route path="/visitor/:visitorId" element={<VisitorProfileScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </BrowserRouter>
  )
}
