import s from '../docs.module.scss';

export function HooksSection() {
  return (
    <section className={s.section} id="hooks">
      <div className={s.sectionEyebrow}>Reference</div>
      <h2 className={s.sectionTitle}>Hooks</h2>
      <p className={s.sectionDesc}>
        All internal hooks are exported for building fully custom calendar UIs.
      </p>

      <div className={s.hookCard}>
        <h4>useCalendar</h4>
        <p>Main orchestration hook. Powers the Calendar component internally. Returns date, view, visible range, events, navigation, and dateLabel.</p>
      </div>
      <div className={s.hookCard}>
        <h4>useViewState</h4>
        <p>Manages date + view state with controlled/uncontrolled support.</p>
      </div>
      <div className={s.hookCard}>
        <h4>useNavigation</h4>
        <p>Returns navigation actions: goToToday, goToPrev, goToNext, goToDate.</p>
      </div>
      <div className={s.hookCard}>
        <h4>useDateRange</h4>
        <p>Computes the visible date range for the current view.</p>
      </div>
      <div className={s.hookCard}>
        <h4>useControllable</h4>
        <p>Generic hook for both controlled and uncontrolled component patterns.</p>
      </div>
      <div className={s.hookCard}>
        <h4>useTimeGrid</h4>
        <p>Generates time slots and pixel/minute conversion utilities.</p>
      </div>
      <div className={s.hookCard}>
        <h4>useEventLayout</h4>
        <p>Computes positioned layout for overlapping timed events within a day column.</p>
      </div>
      <div className={s.hookCard}>
        <h4>useDragEvent / useResizeEvent</h4>
        <p>Internal hooks for drag-to-move and drag-to-resize behavior. Exported for custom view implementations.</p>
      </div>
      <div className={s.hookCard}>
        <h4>useCalendarContext / useCalendarConfig / useCalendarState</h4>
        <p>Access calendar context from within custom slot components.</p>
      </div>
    </section>
  );
}
