import s from '../docs.module.scss';

export function CssVariablesSection() {
  return (
    <section className={`${s.section} ${s.sectionAlt}`} id="css-variables">
      <div className={s.sectionEyebrow}>Reference</div>
      <h2 className={s.sectionTitle}>CSS Variables</h2>
      <p className={s.sectionDesc}>
        Override these custom properties on the calendar container or any ancestor element.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table className={s.propsTable}>
          <thead>
            <tr><th>Variable</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td>--tempora-bg</td><td>#fff</td><td>Main background</td></tr>
            <tr><td>--tempora-bg-secondary</td><td>#f8f9fa</td><td>Secondary background</td></tr>
            <tr><td>--tempora-bg-today</td><td>#e8f0fe</td><td>Today highlight</td></tr>
            <tr><td>--tempora-bg-weekend</td><td>transparent</td><td>Weekend columns</td></tr>
            <tr><td>--tempora-bg-outside</td><td>transparent</td><td>Outside-month days</td></tr>
            <tr><td>--tempora-text-primary</td><td>#3c4043</td><td>Primary text</td></tr>
            <tr><td>--tempora-text-secondary</td><td>#70757a</td><td>Secondary text</td></tr>
            <tr><td>--tempora-text-disabled</td><td>#dadce0</td><td>Disabled text</td></tr>
            <tr><td>--tempora-text-on-primary</td><td>#fff</td><td>Text on primary elements</td></tr>
            <tr><td>--tempora-primary</td><td>#1a73e8</td><td>Accent color</td></tr>
            <tr><td>--tempora-primary-hover</td><td>#1765cc</td><td>Accent hover state</td></tr>
            <tr><td>--tempora-border</td><td>#dadce0</td><td>Border color</td></tr>
            <tr><td>--tempora-border-light</td><td>#e8eaed</td><td>Light borders (slot lines)</td></tr>
            <tr><td>--tempora-event-default-bg</td><td>#039be5</td><td>Default event background</td></tr>
            <tr><td>--tempora-event-default-text</td><td>#fff</td><td>Default event text</td></tr>
            <tr><td>--tempora-current-time</td><td>#ea4335</td><td>Current time indicator</td></tr>
            <tr><td>--tempora-font-family</td><td>system stack</td><td>Font family</td></tr>
            <tr><td>--tempora-font-size</td><td>14px</td><td>Base font size</td></tr>
            <tr><td>--tempora-toolbar-height</td><td>56px</td><td>Toolbar height</td></tr>
            <tr><td>--tempora-gutter-width</td><td>60px</td><td>Time gutter width</td></tr>
            <tr><td>--tempora-header-height</td><td>68px</td><td>Day header height</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className={s.subTitle}>Keyboard shortcuts</h3>
      <table className={s.propsTable}>
        <thead>
          <tr><th>Key</th><th>Action</th></tr>
        </thead>
        <tbody>
          <tr><td>ArrowLeft</td><td>Previous period</td></tr>
          <tr><td>ArrowRight</td><td>Next period</td></tr>
          <tr><td>T</td><td>Go to today</td></tr>
        </tbody>
      </table>
    </section>
  );
}
