import { useEffect, useRef } from 'react';

export function useWhyDidYouUpdate(componentName: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>({});

  useEffect(() => {
    const changedProps: Record<string, { from: any; to: any }> = {};

    Object.keys({ ...previousProps.current, ...props }).forEach((key) => {
      if (previousProps.current[key] !== props[key]) {
        changedProps[key] = {
          from: previousProps.current[key],
          to: props[key],
        };
      }
    });

    if (Object.keys(changedProps).length > 0) {
      console.log(`[why-did-you-update] ${componentName}`, changedProps);
    }

    previousProps.current = props;
  });
}