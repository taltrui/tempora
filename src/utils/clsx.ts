type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function clsx(...args: ClassValue[]): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg && arg !== 0) continue;

    if (Array.isArray(arg)) {
      const inner = clsx(...arg);
      if (inner) classes.push(inner);
    } else {
      classes.push(String(arg));
    }
  }

  return classes.join(' ');
}
