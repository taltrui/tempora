import type { CalendarView } from '../../types/view.ts';
import { useCalendarConfig, useCalendarState } from '../../context/calendar-context.ts';
import { clsx } from '../../utils/clsx.ts';
import styles from './toolbar.module.scss';

const VIEWS: CalendarView[] = ['day', 'week', 'month', 'year', 'agenda'];

export function Toolbar() {
  const { slots } = useCalendarConfig();
  const { date, view, dateLabel, navigation, setView } = useCalendarState();

  if (slots?.toolbar) {
    const ToolbarSlot = slots.toolbar;
    return (
      <ToolbarSlot
        date={date}
        view={view}
        dateLabel={dateLabel}
        onToday={navigation.goToToday}
        onPrev={navigation.goToPrev}
        onNext={navigation.goToNext}
        onViewChange={setView}
      />
    );
  }

  return (
    <div className={styles.toolbar}>
      <button
        className={styles.todayButton}
        onClick={navigation.goToToday}
        type="button"
      >
        Today
      </button>
      <button
        className={styles.navButton}
        onClick={navigation.goToPrev}
        aria-label="Previous"
        type="button"
      >
        &#8249;
      </button>
      <button
        className={styles.navButton}
        onClick={navigation.goToNext}
        aria-label="Next"
        type="button"
      >
        &#8250;
      </button>
      <h2 className={styles.dateLabel}>{dateLabel}</h2>
      <div className={styles.viewSelector}>
        {VIEWS.map((v) => (
          <button
            key={v}
            className={clsx(styles.viewButton, view === v && styles.active)}
            onClick={() => setView(v)}
            type="button"
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
