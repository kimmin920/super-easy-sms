import { useConfig } from '@/hooks/useConfig';
import { useEffect } from 'react';
import type { Theme } from '~/constants/theme';
import ThemeCustomizer from './ThemeCustomizer';
import { Separator } from '@/components/ui/separator';

function AppearanceSettingPage() {
  const [config, setConfig] = useConfig();

  function onClickNewTheme(theme: Theme['name']) {
    setConfig({
      theme: theme,
      style: 'new-york',
      radius: 0.5,
    });
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Appearance</h3>
        <p className='text-sm text-muted-foreground'>Manage appearance.</p>
      </div>

      <Separator />

      <ThemeCustomizer />
    </div>
  );
}

export default AppearanceSettingPage;
