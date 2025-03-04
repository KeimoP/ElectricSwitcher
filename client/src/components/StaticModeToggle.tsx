
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

export function StaticModeToggle() {
  const [isStatic, setIsStatic] = useState(
    localStorage.getItem('use-static-mode') === 'true'
  );

  const handleToggle = () => {
    const newValue = !isStatic;
    localStorage.setItem('use-static-mode', newValue ? 'true' : 'false');
    setIsStatic(newValue);
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 flex items-center space-x-2 bg-background/80 backdrop-blur-sm p-2 rounded-md border shadow-sm">
      <Switch id="static-mode" checked={isStatic} onCheckedChange={handleToggle} />
      <Label htmlFor="static-mode" className="text-xs">
        GitHub Pages Mode {isStatic ? 'On' : 'Off'}
      </Label>
    </div>
  );
}
