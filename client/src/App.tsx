import { useEffect, useState } from 'react';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { AuthScreen } from './components/AuthScreen';
import { BiometricPromptModal } from './components/BiometricPromptModal';
import { DesktopBlockScreen } from './components/DesktopBlockScreen';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { LockScreen } from './components/LockScreen';
import { OfflineBanner } from './components/OfflineBanner';
import { OtpScreen } from './components/OtpScreen';
import { useAuth } from './hooks/useAuth';
import { NotesPage } from './pages/NotesPage';
import { resendRegisterOtpApi, startRegistrationApi, verifyRegistrationApi } from './services/auth';
import { isMobileDevice } from './utils/device';

export default function App() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [pendingRegEmail, setPendingRegEmail] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const auth = useAuth();

  useEffect(() => { setIsMobile(isMobileDevice()); }, []);

  if (isMobile === null) return null;
  if (!isMobile) return <DesktopBlockScreen />;

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#18181b] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-stone-300 dark:border-stone-700 border-t-amber-600 animate-spin" />
      </div>
    );
  }

  if (pendingRegEmail) {
    return (
      <OtpScreen
        email={pendingRegEmail}
        error={regError}
        onVerify={async (code) => {
          setRegError(null);
          try {
            const { user } = await verifyRegistrationApi(pendingRegEmail, code);
            auth.setAuthenticatedUser(user);
          } catch (err: any) {
            setRegError(err.message || 'Verification failed');
            throw err;
          }
        }}
        onSuccess={() => setPendingRegEmail(null)}
        onResend={async () => { setRegError(null); await resendRegisterOtpApi(pendingRegEmail); }}
        onChangeEmail={() => { setPendingRegEmail(null); setRegError(null); }}
      />
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <>
        <AuthScreen
          onLogin={auth.login}
          onStartRegister={async (email, pass, name) => {
            await startRegistrationApi(email, pass, name);
            setPendingRegEmail(email);
          }}
          onForgotPassword={() => setShowForgot(true)}
        />
        {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} onSuccess={() => setShowForgot(false)} />}
      </>
    );
  }

  if (auth.isLocked) {
    return (
      <LockScreen
        onUnlockBiometric={auth.unlockBiometric}
        onUnlockPassword={auth.unlockPassword}
        error={auth.error}
        onClearError={auth.clearError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#18181b] text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      <OfflineBanner />
      <NotesPage onLockNow={auth.lock} onOpenSettings={() => setShowSettings(true)} />
      {showSettings && auth.user && (
        <AccountSettingsModal
          user={auth.user}
          onClose={() => setShowSettings(false)}
          onLockNow={auth.lock}
          onLogout={auth.logout}
          onEnableBiometric={auth.enableBiometric}
          onDisableBiometric={auth.disableBiometric}
        />
      )}
      {auth.showBiometricPrompt && (
        <BiometricPromptModal onEnable={auth.enableBiometric} onDismiss={auth.dismissBiometricPrompt} />
      )}
    </div>
  );
}
