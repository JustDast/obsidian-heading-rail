const { Plugin, MarkdownView, PluginSettingTab, Setting, Notice, Modal, Platform } = require('obsidian');

/* Страховочная копия styles.css — подключается, только если внешний файл
   не загрузился. Собирается автоматически из styles.css, править надо там. */
const FALLBACK_CSS = `/* ============ Heading Rail ============ */

.hr-host {
  position: relative;
}

/* ---------- рельс из полосок ---------- */

.hr-rail {
  position: absolute;
  right: var(--hr-rail-edge, 0px);
  top: 26px;
  bottom: 34px;
  display: flex;
  flex-direction: row;
  gap: var(--hr-col-gap, 10px);
  z-index: 12;
}

/* Столбец полосок. Позиционирован, поэтому бегунок внутри него
   отсчитывается от своего столбца, а не от всего рельса. */
.hr-col {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

/* В многостолбцовом режиме полоски примагничены к верху и не растягиваются */
.hr-multi .hr-col {
  justify-content: flex-start;
}

/* Строка = хитзона. Строки идут вплотную друг к другу:
   визуально между полосками пустота, но для мыши мёртвых зон нет. */
.hr-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* Высота строки задана кодом. Без запрета на сжатие строки ужимались,
     как только видимая часть экрана уменьшалась — например при появлении
     клавиатуры, — и полоски слипались в одну сплошную линию. */
  flex: 0 0 auto;
  padding-right: 8px;
  cursor: pointer;
  transition: padding-right 160ms ease;
}

/* Полоска. Длину, толщину, яркость и прозрачность задаёт код — каждый кадр,
   напрямую. Переходов здесь намеренно нет: они бы догоняли значение, которое
   к тому моменту уже сменилось, и волна отставала бы от курсора.

   Три переменные приходят от волны и имеют запасные значения «в покое»:
   --hr-wave-mix   — сколько цвета волны подмешано (запас: --hr-rest-mix)
   --hr-wave-fade  — множитель непрозрачности (запас: --hr-rest-fade)
   --hr-wave-thick — множитель толщины (запас: 1)
   --hr-bar-own    — свой цвет полоски при цветовом переходе
   --hr-glow       — доля подсветки положения в документе */
.hr-bar {
  /* Толщина и непрозрачность складываются из трёх частей: общей настройки,
     своей для уровня заголовка и того, что добавляет волна. */
  height: calc(var(--hr-bar-thickness, 3px) * var(--hr-level-thick, 1) * var(--hr-wave-thick, 1));
  /* длинная полоска выходит за рельс, а не ужимается под его ширину */
  flex: 0 0 auto;
  /* нажимается строка целиком, поэтому сама полоска мышь не перехватывает */
  pointer-events: none;
  border-radius: 999px;
  /* Подсветка положения не должна тонуть в общей прозрачности: она не
     умножается на неё, а наоборот подтягивает полоску к полной плотности.
     Раньше при непрозрачности ниже ста процентов подсвеченная зона
     становилась почти неразличимой, и казалось, что светится только
     выделенная полоска — та единственная, у которой прозрачность своя. */
  --hr-op-base: calc(
    var(--hr-bar-opacity, 1) * var(--hr-level-fade, 1) *
    var(--hr-wave-fade, var(--hr-rest-fade, 1))
  );
  opacity: calc(
    var(--hr-op-base) + (1 - var(--hr-op-base)) * var(--hr-glow, 0) * var(--hr-glow-lift, 0.7)
  );
  background-color: color-mix(
    in srgb,
    var(--hr-wave-color, var(--text-normal)) var(--hr-wave-mix, var(--hr-rest-mix, 0%)),
    color-mix(
      in srgb,
      var(--hr-glow-color, var(--hr-bar-active, var(--text-normal))) calc(var(--hr-glow, 0) * 100%),
      var(--hr-bar-own, var(--hr-bar-color, var(--text-faint)))
    )
  );
  will-change: width, height, background-color;
}

/* Цвет наведения и цвет текущего заголовка не заменяют цвет волны, а служат
   для неё основой. Иначе самая яркая полоска — та, что под курсором, —
   теряла подсветку ровно в тот момент, когда волна на ней сильнее всего. */
.hr-row:hover .hr-bar {
  background-color: color-mix(
    in srgb,
    var(--hr-wave-color, var(--text-normal)) var(--hr-wave-mix, var(--hr-rest-mix, 0%)),
    var(--hr-bar-own, var(--hr-bar-hover, var(--text-muted)))
  );
}

.hr-row.is-mirror .hr-bar {
  background-color: var(--text-muted);
}

.hr-row.is-active .hr-bar {
  background-color: color-mix(
    in srgb,
    var(--hr-wave-color, var(--text-normal)) var(--hr-wave-mix, var(--hr-rest-mix, 0%)),
    var(--hr-bar-active, var(--text-normal))
  );
  height: calc(var(--hr-bar-thickness, 3px) * var(--hr-level-thick, 1) * var(--hr-wave-thick, 1) + 1px);
  opacity: var(--hr-active-fade, 1);
}

/* В закреплённом режиме ширина фиксирована — это обеспечивает сам код,
   он просто не пересчитывает волну, пока структура раскрыта. */

/* Торцевые зоны: вся пустая область сверху и снизу привязана к своей полоске.
   Визуально видна только тонкая линия, но нажимается всё пространство. */
.hr-end {
  flex: 1;
  min-height: 15px;
  display: flex;
  justify-content: flex-end;
  padding-right: 8px;
  cursor: pointer;
  transition: padding-right 160ms ease;
}

.hr-end-top {
  align-items: flex-end;
  padding-bottom: 7px;
}

.hr-end-bottom {
  align-items: flex-start;
  padding-top: 7px;
}

.hr-panel-visible .hr-end {
  padding-right: 17px;
}

.hr-cap-bar {
  /* Раньше здесь стояли «минус пиксель» и нижний предел в два пикселя: при
     обычной толщине в три пикселя любое значение ниже 110% упиралось в этот
     предел, и ползунок толщины торцов переставал что-либо менять. */
  height: max(1px, calc(var(--hr-bar-thickness, 3px) * var(--hr-cap-thick, 1) * var(--hr-wave-thick, 1)));
  flex: 0 0 auto;
  pointer-events: none;
  border-radius: 2px;
  opacity: calc(var(--hr-cap-fade, 0.75) * var(--hr-wave-fade, var(--hr-rest-fade, 1)));
  background-color: color-mix(
    in srgb,
    var(--hr-wave-color, var(--text-normal)) var(--hr-wave-mix, var(--hr-rest-mix, 0%)),
    var(--hr-bar-color, var(--text-faint))
  );
  will-change: width, height, background-color;
}

.hr-end:hover .hr-cap-bar {
  background-color: color-mix(
    in srgb,
    var(--hr-wave-color, var(--text-normal)) var(--hr-wave-mix, var(--hr-rest-mix, 0%)),
    var(--text-muted)
  );
  opacity: 1;
}

.hr-end:active .hr-cap-bar {
  height: 3px;
  background-color: var(--hr-bar-active, var(--text-normal));
}

/* Бегунок положения раскрытой структуры (появляется только с ней) */
.hr-marker {
  position: absolute;
  right: 7px;
  top: 0;
  width: 2px;
  border-radius: 1px;
  background-color: var(--text-muted);
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease,
              transform 120ms cubic-bezier(0.22, 1, 0.36, 1),
              height 120ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hr-panel-visible .hr-marker {
  opacity: 0.65;
}

/* Освобождаем место под бегунок — полоски уезжают чуть левее */
.hr-panel-visible .hr-row {
  padding-right: 17px;
}

/* ---------- панель со структурой ---------- */

/* Обёртка: поиск и структура. Высота ограничена размахом полосок. */
.hr-side {
  position: absolute;
  /* --hr-panel-shift ставится кодом и равен нулю, пока полоски при раскрытой
     структуре статичны. Как только волна при ней разрешена, список отъезжает
     ровно на то, что полоски отбирают на пике. */
  right: calc(var(--hr-rail-w, 56px) + var(--hr-panel-gap, 8px) + var(--hr-panel-shift, 0px));
  top: calc(50% + var(--hr-center-offset, 0px));
  transform: translateY(-50%) translateX(8px);
  width: 250px;
  max-height: var(--hr-span, 70%);
  display: flex;
  flex-direction: column;
  gap: 26px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease, transform 160ms ease;
  z-index: 11;
}

.hr-panel-visible .hr-side {
  opacity: 1;
  pointer-events: all;
  transform: translateY(-50%) translateX(0);
}

/* Поменять местами: поиск снизу, структура сверху */
.hr-side.hr-search-bottom {
  flex-direction: column-reverse;
}

.hr-search {
  flex: 0 0 auto;
}

/* При удержании Ctrl набирать всё равно нельзя — поиск скрыт */
.hr-ctrl-peek .hr-search {
  display: none;
}

/* Селектор намеренно подробный: тема может оформлять поля ввода по-своему,
   и его точность перевешивает её правила по обычным правилам приоритета,
   оставляя теме возможность при желании переопределить вид. */
.hr-host .hr-side .hr-search input.hr-search-input {
  width: 100%;
  height: 32px;
  box-sizing: border-box;
  padding: 0 14px;
  font-size: 13px;
  border-radius: var(--hr-radius, 16px);
  border: 1px solid var(--background-modifier-border);
  background-color: var(--hr-panel-bg, var(--background-primary));
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
  color: var(--text-normal);
  outline: none;
  transition: border-color 120ms ease;
}

.hr-host .hr-side .hr-search input.hr-search-input:focus {
  border-color: var(--text-muted);
}

.hr-panel-item.hr-hidden {
  display: none;
}

.hr-panel {
  position: relative;
  flex: 0 1 auto;
  min-height: 0;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--hr-panel-bg, var(--background-primary));
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--hr-panel-radius, 10px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
  overflow: visible;   /* указатели парят снаружи панели */
}

.hr-panel-list {
  overflow-y: auto;
  padding: 8px 6px;
  border-radius: 9px;        /* обрезка текста по скруглению вместо панели */
  overscroll-behavior: contain;  /* прокрутка не утекает в документ */
  min-height: 0;             /* иначе flex-элемент не сжимается и не прокручивается */
}

.hr-panel-item {
  font-size: 13px;
  line-height: 1.35;
  padding: 4px 8px;
  border-radius: 6px;
  color: var(--hr-panel-text, var(--text-muted));
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background-color 90ms ease, color 90ms ease;
}

.hr-panel-item:hover,
.hr-panel-item.is-hover {
  background-color: var(--background-modifier-hover);
  color: var(--hr-panel-text, var(--text-normal));
}

.hr-panel-item.is-active {
  color: var(--hr-panel-active-text, var(--text-normal));
  font-weight: 600;
}

.hr-lvl-1 { padding-left: 8px;  font-weight: 600; color: var(--hr-panel-text, var(--text-normal)); }
.hr-lvl-2 { padding-left: 20px; }
.hr-lvl-3 { padding-left: 32px; }
.hr-lvl-4 { padding-left: 44px; font-size: 12px; }
.hr-lvl-5 { padding-left: 56px; font-size: 12px; }
.hr-lvl-6 { padding-left: 68px; font-size: 12px; }

/* Указатели: активное место ушло выше или ниже видимой зоны структуры.
   Парят снаружи панели, цвет — как у выделения текущего места. */
.hr-edge {
  position: absolute;
  left: 50%;
  width: 35px;
  height: 5px;
  transform: translateX(-50%);
  border-radius: 999px;
  background-color: var(--hr-bar-active, var(--text-normal));
  opacity: 0;
  pointer-events: none;
  cursor: pointer;
  transition: opacity 140ms ease,
              width 130ms cubic-bezier(0.22, 1, 0.36, 1),
              height 130ms cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 2;
}

.hr-edge-top { bottom: calc(100% + 12px); }
.hr-edge-bottom { top: calc(100% + 12px); }

.hr-edge.is-shown {
  opacity: 0.85;
  pointer-events: all;
}

/* Невидимая зона реакции заметно больше самой пилюли — чтобы не прицеливаться.
   Вниз/вверх к панели расширяем меньше, чтобы не перекрыть первый и последний пункт. */
.hr-edge::before {
  content: '';
  position: absolute;
  left: -26px;
  right: -26px;
  top: -11px;
  bottom: -11px;
}

.hr-edge.is-shown:hover {
  opacity: 1;
  width: 53px;   /* примерно в полтора раза шире */
  height: 6px;   /* и немного выше */
}

/* Выделение разделов */
.hr-panel-item.is-selected {
  background-color: var(--background-modifier-hover);
  box-shadow: inset 2px 0 0 var(--hr-bar-active, var(--text-normal));
}

/* Всплывающие действия слева от пункта */
.hr-item-menu {
  position: absolute;
  right: calc(100% + 10px);
  transform: translateY(-50%);
  display: none;
  align-items: center;
  gap: 6px;
  padding: 5px;
  border-radius: 6px;
  background-color: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
  white-space: nowrap;
  z-index: 14;
}

.hr-item-menu.is-shown {
  display: flex;
}

/* Невидимая заглушка на месте меню: сохраняет размер и продолжает
   принимать курсор, поэтому нажатие кнопки не считается уходом мыши */
.hr-item-menu.is-ghost {
  background-color: transparent;
  border-color: transparent;
  box-shadow: none;
  padding: 0;
}

.hr-mi {
  font-size: 12px;
  line-height: 1;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid transparent;
  background-color: var(--background-secondary);
  color: var(--text-normal);
  cursor: pointer;
  transition: background-color 110ms ease, color 110ms ease;
}

.hr-mi:hover {
  background-color: var(--background-modifier-hover);
}

.hr-mi-danger {
  background-color: var(--text-error, #c0392b);
  color: #fff;
}

.hr-mi-danger:hover {
  filter: brightness(1.08);
  background-color: var(--text-error, #c0392b);
}

.hr-btn {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid var(--background-modifier-border);
  background-color: var(--background-primary);
  color: var(--text-normal);
  cursor: pointer;
}

.hr-btn:hover {
  background-color: var(--background-modifier-hover);
}

/* Окно «Удалённые разделы» */
.hr-trash-head {
  margin: 14px 0 4px 0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.hr-trash-empty {
  font-size: 12px;
  color: var(--text-faint);
  margin: 0 0 6px 0;
}

.hr-trash-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 0;
}

.hr-trash-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-top: 1px solid var(--background-modifier-border);
}

.hr-trash-info {
  flex: 1;
  min-width: 0;
}

.hr-trash-title {
  font-size: 13px;
  color: var(--text-normal);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hr-trash-meta {
  font-size: 11px;
  color: var(--text-muted);
}

/* ---------- панель отодвигает текст, а не перекрывает ---------- */

.hr-host .markdown-source-view,
.hr-host .markdown-reading-view {
  transition: padding-right 180ms ease;
}

.hr-host.hr-panel-visible .markdown-source-view,
.hr-host.hr-panel-visible .markdown-reading-view {
  padding-right: var(--hr-push, 330px);
}

/* ---------- кнопка в панели инструментов ---------- */

.hr-action-btn.is-active {
  color: var(--text-accent);
}


/* ============ Телефон: структура блоком в углу, текст не отодвигается ============ */

/* Экран узкий — отодвигать текст некуда, структура ложится поверх */
.hr-mobile.hr-panel-visible .markdown-source-view,
.hr-mobile.hr-panel-visible .markdown-reading-view {
  padding-right: 0;
}

/* Блок в левом верхнем углу. Границы сверху и снизу заданы явно,
   чтобы он не залезал под шапку заметки и панель действий Obsidian. */
.hr-mobile .hr-side {
  left: 8px;
  right: auto;
  top: 58px;
  width: min(78vw, 320px);
  max-height: min(52vh, calc(100% - 170px));
  gap: 10px;
  transform-origin: top left;
  transform: translate(-10px, -6px) scale(0.96);
  transition: opacity 260ms cubic-bezier(0.32, 0.72, 0, 1),
              transform 320ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform, opacity;
}

.hr-mobile.hr-panel-visible .hr-side {
  transform: translate(0, 0) scale(1);
}

/* На телефоне фон панели брался как у страницы и выглядел провалом.
   Берём тон интерфейса — он совпадает с боковыми панелями самого Obsidian. */
.hr-mobile .hr-panel {
  background-color: var(--background-secondary);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.28);
}

.hr-mobile .hr-panel-list {
  padding: 6px 4px;
  background-color: transparent;
}

.hr-mobile.hr-host .hr-side .hr-search input.hr-search-input {
  height: 36px;
  font-size: 14px;
  background-color: var(--background-secondary);
}

/* Палец крупнее курсора — строки просторнее */
.hr-mobile .hr-panel-item {
  padding: 9px 10px;
  font-size: 14px;
}

/* Действия — полосой по низу блока, слева места нет */
.hr-mobile .hr-item-menu {
  left: 6px;
  right: 6px;
  bottom: 6px;
  top: auto;
  transform: none;
  justify-content: center;
  background-color: var(--background-secondary);
}

.hr-mobile .hr-mi {
  padding: 9px 14px;
  font-size: 13px;
}

/* Указатели у краёв крупнее, чтобы попадать пальцем */
.hr-mobile .hr-edge {
  width: 46px;
  height: 7px;
}

.hr-mobile .hr-edge::before {
  left: -40px;
  right: -40px;
  top: -16px;
  bottom: -16px;
}

/* Полоски выше и отзывчивее: попасть пальцем в 3 пикселя нельзя,
   а движение должно ощущаться лёгким, а не ступенчатым */
/* Толщина на телефоне задаётся настройкой профиля, а не жёстко здесь:
   раньше это правило перебивало ползунок толщины и он ничего не менял. */
.hr-mobile .hr-row.is-active .hr-bar {
  height: calc(var(--hr-bar-thickness, 4px) * var(--hr-wave-thick, 1) + 1px);
}

/* Открыта клавиатура: рельс убираем целиком. Раньше он пересчитывался
   под остаток высоты, и полоски слипались в сплошную линию. */
/* Открыта клавиатура: рельс убираем целиком. Ужимать его под остаток
   высоты бессмысленно — полоски всё равно слипаются в сплошную линию. */
.hr-kb .hr-rail {
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease;
}


/* ============ Полоски у левого края ============ */

.hr-left .hr-rail {
  right: auto;
  left: var(--hr-rail-edge, 0px);
  flex-direction: row-reverse;
}

.hr-left .hr-row,
.hr-left .hr-end,
.hr-left .hr-cap {
  justify-content: flex-start;
  padding-right: 0;
  padding-left: 8px;
}

.hr-left.hr-panel-visible .hr-row,
.hr-left.hr-panel-visible .hr-end {
  padding-right: 0;
  padding-left: 17px;
}

.hr-left .hr-marker {
  right: auto;
  left: 7px;
}

/* структура переезжает вправо от полосок */
.hr-left .hr-side {
  right: auto;
  left: calc(var(--hr-rail-w, 56px) + var(--hr-panel-gap, 8px) + var(--hr-panel-shift, 0px));
  transform: translateY(-50%) translateX(-8px);
}

.hr-left.hr-panel-visible .hr-side {
  transform: translateY(-50%) translateX(0);
}

.hr-left.hr-host.hr-panel-visible .markdown-source-view,
.hr-left.hr-host.hr-panel-visible .markdown-reading-view {
  padding-right: 0;
  padding-left: var(--hr-push, 330px);
}

.hr-left .hr-item-menu {
  right: auto;
  left: calc(100% + 10px);
}

.hr-left .hr-preview {
  right: auto;
  left: calc(var(--hr-rail-w, 56px) + var(--hr-wave-room, 0px) + var(--hr-preview-gap, 12px));
}

/* ============ Подсказка при наведении ============ */

.hr-preview {
  position: absolute;
  /* --hr-wave-room — запас под полоски, которые на пике длиннее рельса.
     Без него самая длинная полоска ложилась поверх окошка. */
  right: calc(var(--hr-rail-w, 56px) + var(--hr-wave-room, 0px) + var(--hr-preview-gap, 12px));
  transform: translateY(-50%) scale(0.98);
  width: var(--hr-preview-w, 260px);
  max-width: 46vw;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: var(--hr-preview-radius, 12px);
  background-color: var(--hr-preview-bg, var(--hr-panel-bg, var(--background-primary)));
  border: 1px solid var(--background-modifier-border);
  box-shadow: 0 10px 34px rgba(0, 0, 0, 0.32);
  opacity: 0;
  pointer-events: none;
  transition: opacity 130ms ease, transform 130ms cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 15;
}

.hr-preview.is-shown {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.hr-preview-title {
  font-family: var(--hr-preview-title-font, var(--font-interface));
  font-size: var(--hr-preview-title-size, 13px);
  font-weight: var(--hr-preview-title-weight, 600);
  color: var(--hr-preview-title-color, var(--text-normal));
  margin-bottom: 5px;
}

.hr-preview-body {
  font-family: var(--hr-preview-text-font, var(--font-interface));
  font-size: var(--hr-preview-text-size, 12px);
  font-weight: var(--hr-preview-text-weight, 400);
  line-height: var(--hr-preview-line, 1.45);
  color: var(--hr-preview-text-color, var(--text-muted));
}



/* ============ Якорь рельса по высоте ============ */

.hr-rail.hr-anchor-top .hr-col { justify-content: flex-start; }
.hr-rail.hr-anchor-bottom .hr-col { justify-content: flex-end; }

/* ============ Телефон: зеркальная раскладка при левом положении ============

   Мобильные правила раньше жёстко прижимали блок структуры к левому краю.
   При переносе полосок налево они наезжали друг на друга: полоски вставали
   на место структуры, а та уходила к центру. Здесь левый режим описан
   симметрично правому.                                                      */

.hr-mobile.hr-left .hr-side {
  left: auto;
  right: 8px;
  transform: translate(10px, -6px) scale(0.96);
  transform-origin: top right;
}

.hr-mobile.hr-left.hr-panel-visible .hr-side {
  transform: translate(0, 0) scale(1);
}

.hr-mobile.hr-left.hr-host.hr-panel-visible .markdown-source-view,
.hr-mobile.hr-left.hr-host.hr-panel-visible .markdown-reading-view {
  padding-left: 0;
  padding-right: 0;
}

/* подсказка на телефоне снова работает — показывается при протяжке пальцем */
.hr-mobile .hr-preview {
  display: block;
  width: min(74vw, var(--hr-preview-w, 300px));
}

/* ============ Экран настроек ============ */

.hr-settings-tabs {
  display: flex;
  gap: 6px;
  margin: 14px 0 4px 0;
}

.hr-settings-tab {
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid var(--background-modifier-border);
  background-color: var(--background-primary);
  color: var(--text-muted);
  cursor: pointer;
}

/* Выбранная вкладка обводится, а не заливается серым: серый на кнопке
   читается как «недоступна», а не как «выбрана». */
.hr-settings-tab.is-active {
  border-color: var(--text-accent);
  box-shadow: inset 0 0 0 1px var(--text-accent);
  background-color: transparent;
  color: var(--text-accent);
  font-weight: 600;
}

.hr-settings-hint {
  font-size: 12px;
  color: var(--text-muted);
  margin: 2px 0 8px 0;
}

/* Настройка, значение которой берётся с компьютера */
.hr-setting-linked {
  opacity: 0.55;
}

/* Сворачиваемый раздел настроек. Заголовок работает как кнопка, тело
   раздела чуть отодвинуто вправо — чтобы вложенная «тонкая настройка»
   была видна как часть своего раздела, а не как отдельный список. */
.hr-settings-group {
  margin: 10px 0 2px 0;
  border-top: 1px solid var(--background-modifier-border);
}

.hr-settings-summary {
  padding: 10px 2px;
  color: var(--text-normal);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
  user-select: none;
}

/* Свой треугольник вместо системного: он по-разному выглядит на разных
   платформах, а на телефоне бывает почти незаметен */
.hr-settings-summary::-webkit-details-marker { display: none; }

.hr-settings-summary::before {
  content: '▸';
  display: inline-block;
  width: 14px;
  color: var(--text-muted);
  transition: transform 120ms ease;
}

.hr-settings-group[open] > .hr-settings-summary::before {
  transform: rotate(90deg);
}

.hr-settings-summary:hover {
  color: var(--text-accent);
}

.hr-settings-body {
  padding-left: 14px;
}

/* Вложенный раздел: тоньше и спокойнее, чтобы не спорить с верхним */
.hr-settings-body .hr-settings-group {
  margin-top: 4px;
  border-top: none;
}

.hr-settings-body .hr-settings-summary {
  padding: 8px 2px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
}

/* Торцы, оставленные только для вида: нажатие на них ничего не делает,
   поэтому и курсор не должен обещать обратное */
.hr-end-quiet {
  pointer-events: none;
  cursor: default;
}

/* Окно «поделиться своим набором» */
.hr-share-box {
  width: 100%;
  height: 220px;
  margin: 8px 0;
  padding: 8px 10px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background-color: var(--background-secondary);
  color: var(--text-muted);
  font-family: var(--font-monospace);
  font-size: 12px;
  resize: vertical;
}

.hr-share-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

/* Контакт автора внизу настроек */
.hr-settings-contact {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--background-modifier-border);
  font-size: 12px;
  color: var(--text-muted);
}

/* След переезжающего выделения. --hr-travel ставится кодом на строке рельса
   и означает, сколько сейчас на этой полоске «метки»: единица в точке, куда
   она едет, меньше — по дороге. */
.hr-row .hr-bar {
  --hr-travel-mix: calc(var(--hr-travel, 0) * 100%);
}

.hr-row[style*="--hr-travel"] .hr-bar {
  background-color: color-mix(
    in srgb,
    var(--hr-bar-active, var(--text-normal)) var(--hr-travel-mix, 0%),
    color-mix(
      in srgb,
      var(--hr-wave-color, var(--text-normal)) var(--hr-wave-mix, var(--hr-rest-mix, 0%)),
      color-mix(
        in srgb,
        var(--hr-glow-color, var(--hr-bar-active, var(--text-normal))) calc(var(--hr-glow, 0) * 100%),
        var(--hr-bar-own, var(--hr-bar-color, var(--text-faint)))
      )
    )
  );
  opacity: calc(
    var(--hr-op-base) + (1 - var(--hr-op-base)) *
    max(var(--hr-glow, 0) * var(--hr-glow-lift, 0.7), var(--hr-travel, 0))
  );
}

/* Подсветка текущей полоски выключена настройкой: класс остаётся — он нужен
   структуре и переходам, — а окраска полоски возвращается к обычной */
.hr-row.is-active.hr-no-active-paint .hr-bar {
  background-color: color-mix(
    in srgb,
    var(--hr-wave-color, var(--text-normal)) var(--hr-wave-mix, var(--hr-rest-mix, 0%)),
    color-mix(
      in srgb,
      var(--hr-glow-color, var(--hr-bar-active, var(--text-normal))) calc(var(--hr-glow, 0) * 100%),
      var(--hr-bar-own, var(--hr-bar-color, var(--text-faint)))
    )
  );
  opacity: calc(
    var(--hr-op-base) + (1 - var(--hr-op-base)) * var(--hr-glow, 0) * var(--hr-glow-lift, 0.7)
  );
}

.hr-settings-contribute {
  margin-top: 8px;
  max-width: 560px;
  line-height: 1.5;
}
`;

/* ---------------------------- строки интерфейса ---------------------------- */
// Один язык сейчас, но структура готова под добавление других:
// достаточно дописать соседний объект по образцу `en` и подключить его в LOCALES.
const LOCALES = {
  en: {
    tocTooltip: 'Note structure',
    trashTooltip: 'Section history',
    searchPlaceholder: 'Search structure',
    startOfDoc: 'Start of document',
    endOfDoc: 'End of document',
    jumpAboveLabel: 'Current position is above — show it',
    jumpBelowLabel: 'Current position is below — show it',
    delete: 'Delete',
    deleteN: (n) => 'Delete ' + n,
    copy: 'Copy',
    copyN: (n) => 'Copy ' + n,
    copyAgain: 'Copy again',
    cancel: 'Cancel',
    restore: 'Restore',
    forget: 'Forget',
    historyTitle: 'Section history',
    trashCopiedHead: 'Copied',
    trashCopiedEmpty: 'Nothing copied yet.',
    trashDeletedHead: 'Deleted',
    trashDeletedEmpty: 'Nothing deleted yet.',
    trashHint: 'Newest first. If the file was edited after a deletion, restore later entries first.',
    settingSearchName: 'Search field',
    settingSearchDesc: 'Show a search box next to the expanded structure.',
    settingSearchBottomName: 'Search at bottom',
    settingSearchBottomDesc: 'Swap places: search below the structure, structure on top.',
    settingTrashMaxName: 'Keep deletions',
    settingTrashMaxDesc: 'How many entries to keep in the deleted-sections list.',
    cmdDeleteSelected: 'Delete selected sections',
    cmdCopySelected: 'Copy selected sections',
    cmdRestoreLast: 'Restore last deletion',
    noticeReadFail: 'Heading Rail: could not read the file',
    noticeStale: 'Structure is outdated — refresh the list and try again',
    noticeDeleted: (sections, lines) => 'Deleted sections: ' + sections + ', lines: ' + lines,
    noticeNothingToRestore: 'Nothing to restore',
    noticeFileNotFound: 'File not found',
    noticeReadFail2: 'Could not read the file',
    noticeChangedAfterDelete: 'The file changed after this deletion. Restore later entries first, or use Ctrl+Z.',
    noticeRestored: 'Deletion restored',
    noticeCopied: (sections, lines) => 'Copied sections: ' + sections + ', lines: ' + lines,
    noticeCopyFail: 'Could not copy to the clipboard',
    noticeRestoreFail: (msg) => 'Could not restore: ' + msg,
    settingsSectionLayout: 'Layout',
    settingsSectionColour: 'Colour',
    settingsSectionPreview: 'Hover preview',
    settingsSectionOutline: 'Outline',
    settingSideName: 'Side',
    settingSideDesc: 'Which edge of the note the bars are docked to.',
    optRight: 'Right',
    optLeft: 'Left',
    settingSpacingName: 'Spacing between bars',
    settingSpacingDesc: 'Adaptive spreads the bars over the available height. Fixed keeps the same gap no matter how many headings there are.',
    optAdaptive: 'Adaptive',
    optFixed: 'Fixed',
    settingFixedSpacingName: 'Fixed spacing',
    settingFixedSpacingDesc: 'Gap between bars in pixels.',
    settingHoverScrollName: 'Scroll on hover',
    settingHoverScrollDesc: 'Move the document as the cursor passes over the bars, without clicking.',
    settingBarColorName: 'Bar colour',
    settingBarColorDesc: 'Leave empty to follow the theme. Any CSS colour works.',
    settingActiveColorName: 'Active bar colour',
    settingActiveColorDesc: 'Colour of the bar marking your current position. Empty follows the theme accent.',
    settingGradientName: 'Gradient',
    settingGradientDesc: 'Fade the bars from one colour to another down the rail. Overrides the bar colour above.',
    settingGradientStartName: 'Gradient start',
    settingGradientEndName: 'Gradient end',
    settingPreviewToggleName: 'Show preview',
    settingPreviewToggleDesc: 'A small card with the heading and the start of its text, shown while hovering.',
    optPreviewOff: 'Do not show',
    optPreviewBars: 'On the bars',
    optPreviewOutline: 'On the outline',
    settingPreviewLenName: 'Preview length',
    settingPreviewLenDesc: 'How many characters of the section text to show.',
    settingLanguageName: 'Language',
    settingLanguageDesc: "Interface language for this plugin. Auto follows Obsidian's own setting.",
    optLanguageAuto: 'Automatic',
    profileDesktop: 'Desktop',
    profileMobile: 'Mobile',
    mobileProfileHint: 'These settings apply on phones and tablets only. Use the link button next to a setting to take its value from the desktop profile instead.',
    linkToDesktop: 'Use the desktop value',
    unlinkFromDesktop: 'Set separately for mobile',
    resetToTheme: 'Back to theme colour',
    settingAnchorName: 'Vertical anchor',
    settingAnchorDesc: 'Where the bars sit along the height of the note.',
    optAnchorCenter: 'Centre',
    optAnchorTop: 'Top',
    optAnchorBottom: 'Bottom',
    settingSpacingMinName: 'Minimum spacing',
    settingSpacingMinDesc: 'The bars never get closer together than this.',
    settingSpacingMaxName: 'Maximum spacing',
    settingSpacingMaxDesc: 'The bars never spread further apart than this, even in a short note.',
    settingThicknessName: 'Bar thickness',
    settingThicknessDesc: 'How thick each bar is, in pixels.',
    settingBarWidthName: 'Bar length',
    settingBarWidthDesc: 'Resting length of the bars, as a percentage of the default for each heading level.',
    settingsSectionWave: 'Wave',
    settingsSectionWaveFine: 'Wave — fine tuning',
    settingsSectionBars: 'Bars',
    settingsSectionLevels: 'Length by heading level',
    settingsSectionGlow: 'Position highlight',
    waveIntro: 'Every bar gets one number each frame: how strongly the wave reaches it. Each property below then travels from its resting value to its peak value along that number, so you can have length without colour, colour without length, or both at once.',
    levelsHint: 'Resting length of a bar, in pixels, before the overall multiplier above is applied.',
    settingPeakModeName: 'Length at the peak',
    settingPeakModeDesc: 'Shared length pulls every bar towards the same length, so the crest of the wave comes out even. Added length gives each bar the same increase on top of its own, so deeper headings stay shorter.',
    optPeakTarget: 'Shared length',
    optPeakAdd: 'Added length',
    settingPeakLengthName: 'Peak length',
    settingPeakLengthDesc: 'How long a bar is at the very centre of the wave, in pixels.',
    settingPeakAddName: 'Peak growth',
    settingPeakAddDesc: 'How many pixels are added to a bar at the very centre of the wave.',
    settingCurveName: 'Wave shape',
    settingCurveDesc: 'How the strength falls away from the centre of the wave.',
    optCurveBell: 'Bell — soft, no visible edge',
    optCurvePeak: 'Peak — sharp centre, long tails',
    optCurvePlateau: 'Plateau — flat top, steep sides',
    optCurveCosine: 'Arc — even curve, clean edge',
    optCurveWedge: 'Wedge — straight fall',
    optCurveStep: 'Step — all or nothing',
    optCurveRipple: 'Ripple — a second, fainter wave behind',
    settingEdgeName: 'Edge sharpness',
    settingEdgeDesc: 'Fine tuning for the chosen shape: higher values narrow it and make the edges harder. The arc, wedge and step shapes ignore this.',
    settingPeakBrightName: 'Brightness at the peak',
    settingPeakBrightDesc: 'How much of the wave colour is mixed into a bar at the centre of the wave. Zero leaves the colour alone and only the length changes.',
    settingRestBrightName: 'Brightness at rest',
    settingRestBrightDesc: 'How much of the wave colour every bar carries while the wave is away.',
    settingWaveColorName: 'Wave colour',
    settingWaveColorDesc: 'The colour mixed into the bars by the wave. By default it follows the text colour of your theme.',
    settingRestOpacityName: 'Opacity at rest',
    settingRestOpacityDesc: 'How solid the bars are while the wave is away.',
    settingPeakOpacityName: 'Opacity at the peak',
    settingPeakOpacityDesc: 'How solid a bar is at the centre of the wave.',
    settingPeakThickName: 'Thickness at the peak',
    settingPeakThickDesc: 'Thickness of a bar at the centre of the wave, as a percentage of its resting thickness. Leave at 100 to keep the thickness steady.',
    settingFollowName: 'Catch-up time',
    settingFollowDesc: 'How long the wave takes to reach the cursor, in milliseconds. Zero pins it to the cursor exactly.',
    settingOvershootName: 'Overshoot',
    settingOvershootDesc: 'How far the wave swings past the cursor on a fast movement before coming back. Zero arrives and stops.',
    settingRiseName: 'Build-up',
    settingRiseDesc: 'How long the wave takes to reach full strength when the cursor arrives.',
    settingFallName: 'Fade out',
    settingFallDesc: 'How long the wave takes to die away after the cursor leaves. Zero snaps back instantly.',
    settingLevelWidthName: (n) => 'Heading level ' + n,
    settingCapWidthName: 'End marks',
    settingCapWidthDesc: 'Length of the two short bars marking the start and the end of the note.',
    optGlowOff: 'Off',
    settingReachName: 'Wave reach',
    settingReachDesc: 'How far the wave spreads from the cursor, measured in bars.',
    settingHorizontalName: 'React to horizontal movement',
    settingHorizontalDesc: 'The bars also grow as the cursor moves sideways, away from the edge.',
    settingHorizontalRangeName: 'Horizontal range',
    settingHorizontalRangeDesc: 'How far from the edge the cursor must travel for the bars to reach full length.',
    settingPreviewTriggerName: 'Show preview on',
    settingPreviewTriggerDesc: 'Which part of the widget brings up the preview card.',
    optTriggerBoth: 'Bars and outline',
    settingPreviewPlaceName: 'Preview position',
    settingPreviewPlaceDesc: 'Automatic moves the card beside the outline while it is open, so it never covers the list.',
    optPlaceAuto: 'Automatic',
    optPlaceRail: 'Beside the bars',
    optPlaceOutline: 'Beside the outline',
    settingPreviewBgName: 'Preview background',
    errWriteConflict: 'the file changed during the operation, please try again',
    noticeModifyFail: (msg) => 'Heading Rail: ' + (msg || 'could not modify the file'),
    consoleFallbackCss: '[Heading Rail] styles.css not found next to main.js — using the built-in copy.',
    consoleStyleCheckFail: '[Heading Rail] could not verify styles:',
    consoleBuildFail: '[Heading Rail] error while building the interface:',
    trashNoTitle: '(untitled)',
    trashMeta: (lines, path, when) => lines + ' lines · ' + path + ' · ' + when,
    settingIntensityName: 'Wave intensity',
    settingIntensityDesc: 'One slider over all the others: it pulls length, brightness, opacity, thickness and — more gently — reach at the same time. Set it to zero and the bars stop reacting entirely; everything below still describes the character of the wave, this only says how loudly.',
    settingRailFromName: 'Rail starts at',
    settingRailFromDesc: 'Top edge of the rail, as a percentage of the note height.',
    settingRailToName: 'Rail ends at',
    settingRailToDesc: 'Bottom edge of the rail, as a percentage of the note height. Together with the setting above this carves out the band the bars live in — and the vertical anchor decides where inside that band they sit when there are too few of them to fill it.',
    panelWaveHint: 'At the peak a bar is longer than the rail, so with the outline open it would lie across the list. These two switches say whether the bars stay still in that state; when they do move, the outline slides aside by exactly what the bars take.',
    settingWavePinnedName: 'Animate while the outline is pinned',
    settingWavePinnedDesc: 'Off keeps the bars at their resting length whenever the outline is pinned open.',
    settingWavePeekName: 'Animate while holding Ctrl',
    settingWavePeekDesc: 'Off keeps the bars still while the outline is being peeked at with Ctrl.',
    linkedNote: 'Currently taking the desktop value — press the chain button to give the phone its own.',
    settingPreviewGapName: 'Distance from the bars',
    settingPreviewGapDesc: 'Gap between the rail and the preview card, in pixels. The space taken by bars at their peak is added on top of this automatically, so the longest bar never lies over the card.',
    settingPreviewWidthName: 'Card width',
    settingPreviewWidthDesc: 'Width of the preview card in pixels, capped by the window width.',
    settingsSectionPreviewType: 'Preview typography',
    previewTypeHint: 'The first three fonts are the ones set in Obsidian itself, so the card can match the note or the interface without picking anything.',
    optFontInterface: "Obsidian's interface font",
    optFontText: "Obsidian's text font",
    optFontMono: "Obsidian's monospace font",
    optFontSystem: 'System',
    optFontSans: 'Sans-serif',
    optFontSerif: 'Serif',
    optFontSlab: 'Slab serif',
    optFontMonospace: 'Monospace',
    settingPreviewTitleFontName: 'Heading font',
    settingPreviewTitleSizeName: 'Heading size',
    settingPreviewTitleWeightName: 'Heading weight',
    settingPreviewTextFontName: 'Text font',
    settingPreviewTextSizeName: 'Text size',
    settingPreviewTextWeightName: 'Text weight',
    settingPreviewLineName: 'Line spacing',
    settingPreviewLineDesc: 'Line height of the preview text, as a percentage of its font size.',
    settingSpanName: 'Bars in the wave',
    settingSpanDesc: (span, side) => 'Always an odd number: one bar in the centre and ' + side + ' on each side. Currently ' + span + '.',
    settingsSectionSteps: 'Length of each step',
    stepsHint: 'Each slider is the length of one bar in pixels at full wave strength. The centre is the bar under the cursor; the rest are mirrored above and below it.',
    settingStepCenterName: 'Centre bar',
    settingStepName: (d) => 'Bar ' + d + ' away',
    settingSharpName: 'Distinct centre',
    settingSharpDesc: 'The bar nearest the cursor always reaches full length and the rest stay strictly shorter. With this off the strength is shared between the two bars the cursor sits between, and a neighbour can end up longer than the one you are pointing at.',
    settingReactZoneName: 'Reaction zone',
    settingReactZoneDesc: 'How far from the rail the bars start responding, in pixels. The strength fades smoothly to nothing at the far edge of the zone, so the wave comes towards the cursor rather than snapping on. Zero means the bars only react once the cursor is over the rail itself.',
    settingHorizontalMinName: 'Strength at the very edge',
    settingHorizontalMinDesc: 'How strong the wave is when the cursor is pressed against the edge of the window, as a percentage of full. Lower values make the rail feel restrained until you move towards the text.',
    settingCapsModeName: 'End marks',
    settingCapsModeDesc: 'The two short bars for the start and the end of the note.',
    optCapsOn: 'Shown, and clickable',
    optCapsQuiet: 'Shown, but not clickable',
    optCapsOff: 'Removed entirely',
    optCurveCustom: 'Your own shape, in pixels',
    settingCenterModeName: 'Where the wave centres',
    settingCenterModeDesc: 'On a bar — the empty space between bars is split down the middle, so while the cursor stays over one bar nothing moves at all; cross the halfway line and the wave slides over to the next one, as smoothly as it would follow the cursor. Freely — the centre sits exactly under the cursor, so the two bars it sits between share the wave and both keep shifting with every small movement.',
    optCenterSnap: 'On a bar',
    optCenterFree: 'Freely, under the cursor',
    settingRailEdgeName: 'Distance from the window edge',
    settingRailEdgeDesc: 'How far the whole rail is pulled away from the edge of the note, in pixels.',
    settingColGapName: 'Gap between columns',
    settingColGapDesc: 'Space between columns of bars on notes long enough to need more than one, in pixels.',
    settingLevelThickName: (n) => 'Level ' + n + ' — thickness',
    settingLevelFadeName: (n) => 'Level ' + n + ' — opacity',
    settingGlowLiftName: 'Highlight brings bars forward',
    settingGlowLiftDesc: 'How far the highlight pulls a bar towards full opacity, as a percentage. Without this the highlight was multiplied by the overall opacity and all but vanished, which made it look as though only the current bar ever lit up.',
    settingGlowColorName: 'Highlight colour',
    settingGlowColorDesc: 'Colour of the position highlight. By default it follows the colour of the current heading.',
    settingsSectionPresets: 'Ready-made styles',
    presetsHint: 'A style is a set of values applied all at once. Pick one, apply it, and carry on adjusting from there — nothing is locked. Styles sent in by other people are added here after the author has checked them.',
    settingPresetName: 'Style',
    settingPresetDesc: 'Applies to the profile you are editing right now. Anything the style does not mention stays as you had it.',
    presetApply: 'Apply',
    presetApplied: (name) => 'Style applied: ' + name,
    settingShareName: 'Share your own style',
    settingShareDesc: 'If you have arrived at something you like, you can send it in. Checked styles are added to the list in a later release.',
    shareOpen: 'Share…',
    shareTitle: 'Share your style',
    shareIntro: 'Below is the set of values you are using right now. Copy it, then send it in an email. Nothing is sent anywhere on its own — the plugin only opens your mail app with the letter ready.',
    shareCopy: 'Copy the settings',
    shareCopied: 'Settings copied to the clipboard',
    shareCopyManual: 'Copy the selected text manually',
    shareMail: 'Open an email',
    shareSubject: 'Heading Rail — a style to consider',
    shareBody: 'Paste the copied settings below this line, and add a name for the style if you have one in mind.\n\n',
    shareNote: 'Only the values of the plugin settings are included. No note text, file names or anything else from your vault goes into this.',
    contactLine: 'Ideas for this plugin, or for another one? Write to the author:',
    settingPreviewTitleColorName: 'Heading colour',
    settingPreviewTextColorName: 'Text colour',
    settingsSectionPanelLook: 'Outline colours',
    settingPanelBgName: 'Outline background',
    settingPanelTextName: 'Outline text',
    settingPanelActiveTextName: 'Current entry',
    presetBase: 'Base',
    glowHint: 'Two separate things, each switched on by itself: the current bar, and the halo around it. The halo is set the same way as bar lengths — how many bars it reaches and how bright each step is, mirrored above and below.',
    settingActiveGlowName: 'Highlight the current bar',
    settingActiveGlowDesc: 'The bar for the heading you are in right now.',
    optGlowAlways: 'Always',
    optGlowHover: 'Only while pointing at the rail',
    optGlowTouch: 'Only while touching the rail',
    settingHaloModeName: 'Halo around it',
    settingHaloModeDesc: 'The neighbours of the current bar, fading away from it.',
    settingHaloSpanName: 'Bars in the halo',
    settingHaloSpanDesc: (span, side) => 'Always an odd number: the current bar and ' + side + ' on each side. Currently ' + span + '.',
    settingsSectionHaloSteps: 'Brightness of each step',
    haloStepsHint: 'How bright a bar is at each distance from the current one, as a percentage. Step one is its immediate neighbour, and the same values are used above and below.',
    settingHaloStepName: (d) => 'Step ' + d,
    colourHint: 'Each colour sits on the same row as its own opacity, and the arrow on the right gives it back to your theme.',
    settingCapThickName: 'End marks — thickness',
    settingCapOpacityName: 'End marks — opacity',
    settingPanelGapName: 'Distance from the bars',
    settingPanelGapDesc: 'Gap between the rail and the outline list, in pixels.',
    settingsSectionPreviewLook: 'Preview colours',
    settingMobileOnName: 'Use the plugin on this phone',
    settingMobileOnDesc: "Obsidian has its own swipe gesture near the edge of the screen, and it can get in the way of the rail. If that makes the phone more trouble than it's worth, switch the plugin off here — the desktop side keeps working exactly as before.",
    mobileOffHint: 'The rail is off on phones. The rest of the phone settings are hidden because nothing here would do anything.',
    settingFollowThemeName: 'Follow the theme',
    settingFollowThemeDesc: 'Colours that come from a ready-made style are adjusted so they never end up light on light or dark on dark: the author of the style picked them for their own theme, not yours. Colours you set yourself are never touched — even if they end up close to the background.',
    settingRadiusName: 'Corner rounding',
    settingRadiusDesc: 'One value for everything the plugin draws: the preview card, the outline list and the search box.',
    settingActiveMoveName: 'When the current bar changes',
    settingActiveMoveDesc: 'Jump — the highlight appears in the new place at once. Travel — it moves there, with a fading trail behind it. Jumping across half the rail is what makes the highlight feel abrupt when you click around the outline.',
    optMoveTravel: 'Travel to the new place',
    optMoveInstant: 'Jump straight there',
    settingTravelTimeName: 'Travel time',
    settingTravelTimeDesc: 'How long the highlight takes to get there, in milliseconds.',
    settingTravelOvershootName: 'Overshoot on arrival',
    settingTravelOvershootDesc: 'How far it swings past the destination before settling.',
    settingTravelTrailName: 'Trail along the way',
    settingTravelTrailDesc: 'How brightly the bars it passes light up. Zero leaves a plain move with nothing behind it.',
    shareNameName: 'Name for the style',
    shareNameDesc: 'Optional. It goes into the letter so the style has something to be called.',
    shareNamePlaceholder: 'for example: Night Ruler',
    shareWhichName: 'What to send',
    shareWhichDesc: 'Each set is labelled in the letter, so desktop and phone never get mixed up.',
    shareBoth: 'Both — desktop and phone',
    presetStateOn: (name) => 'Currently on: ' + name + '.',
    presetStateChanged: (name) => 'Currently on: ' + name + ', with your own changes on top.',
    presetRestore: 'Back to the style',
    settingScrollToName: 'Where the heading lands',
    settingScrollToDesc: 'When you jump to a heading from the rail or the outline, this is where it ends up on screen.',
    optScrollTop: 'At the top',
    optScrollUpper: 'A third of the way down',
    optScrollCenter: 'In the middle',
    contributeLine: 'Made a fork that\'s genuinely better? Send me the source and how you did it. If it really is better, I\'ll ship it in the next version and credit you as a co-author. I may rework your code along the way, but if it served as the basis, you get the credit regardless.',
  },
  de: {
    tocTooltip: 'Notizstruktur',
    trashTooltip: 'Abschnittsverlauf',
    searchPlaceholder: 'Struktur durchsuchen',
    startOfDoc: 'Dokumentanfang',
    endOfDoc: 'Dokumentende',
    jumpAboveLabel: 'Aktuelle Position liegt darüber — anzeigen',
    jumpBelowLabel: 'Aktuelle Position liegt darunter — anzeigen',
    delete: 'Löschen',
    deleteN: (n) => 'Löschen (' + n + ')',
    copy: 'Kopieren',
    copyN: (n) => 'Kopieren (' + n + ')',
    copyAgain: 'Erneut kopieren',
    cancel: 'Abbrechen',
    restore: 'Wiederherstellen',
    forget: 'Verwerfen',
    historyTitle: 'Abschnittsverlauf',
    trashCopiedHead: 'Kopiert',
    trashCopiedEmpty: 'Noch nichts kopiert.',
    trashDeletedHead: 'Gelöscht',
    trashDeletedEmpty: 'Noch nichts gelöscht.',
    trashHint: 'Neueste zuerst. Wurde die Datei nach einem Löschvorgang bearbeitet, zuerst die späteren Einträge wiederherstellen.',
    settingSearchName: 'Suchfeld',
    settingSearchDesc: 'Ein Suchfeld neben der ausgeklappten Struktur anzeigen.',
    settingSearchBottomName: 'Suche unten',
    settingSearchBottomDesc: 'Positionen tauschen: Suche unter der Struktur, Struktur oben.',
    settingTrashMaxName: 'Löschungen aufbewahren',
    settingTrashMaxDesc: 'Wie viele Einträge in der Liste gelöschter Abschnitte behalten werden.',
    cmdDeleteSelected: 'Ausgewählte Abschnitte löschen',
    cmdCopySelected: 'Ausgewählte Abschnitte kopieren',
    cmdRestoreLast: 'Letzte Löschung wiederherstellen',
    noticeReadFail: 'Heading Rail: Datei konnte nicht gelesen werden',
    noticeStale: 'Struktur ist veraltet — Liste aktualisieren und erneut versuchen',
    noticeDeleted: (sections, lines) => 'Gelöschte Abschnitte: ' + sections + ', Zeilen: ' + lines,
    noticeNothingToRestore: 'Nichts wiederherzustellen',
    noticeFileNotFound: 'Datei nicht gefunden',
    noticeReadFail2: 'Datei konnte nicht gelesen werden',
    noticeChangedAfterDelete: 'Die Datei wurde nach dieser Löschung geändert. Zuerst spätere Einträge wiederherstellen oder Strg+Z verwenden.',
    noticeRestored: 'Löschung rückgängig gemacht',
    noticeCopied: (sections, lines) => 'Kopierte Abschnitte: ' + sections + ', Zeilen: ' + lines,
    noticeCopyFail: 'Kopieren in die Zwischenablage fehlgeschlagen',
    noticeRestoreFail: (msg) => 'Wiederherstellung fehlgeschlagen: ' + msg,
    settingsSectionLayout: 'Layout',
    settingsSectionColour: 'Farbe',
    settingsSectionPreview: 'Vorschau beim Hovern',
    settingsSectionOutline: 'Gliederung',
    settingSideName: 'Seite',
    settingSideDesc: 'An welchem Rand der Notiz die Balken angedockt sind.',
    optRight: 'Rechts',
    optLeft: 'Links',
    settingSpacingName: 'Abstand zwischen den Balken',
    settingSpacingDesc: 'Adaptiv verteilt die Balken über die verfügbare Höhe. Fest behält denselben Abstand unabhängig von der Anzahl der Überschriften.',
    optAdaptive: 'Adaptiv',
    optFixed: 'Fest',
    settingFixedSpacingName: 'Fester Abstand',
    settingFixedSpacingDesc: 'Abstand zwischen den Balken in Pixeln.',
    settingHoverScrollName: 'Scrollen beim Hovern',
    settingHoverScrollDesc: 'Das Dokument bewegen, während der Cursor über die Balken fährt, ohne zu klicken.',
    settingBarColorName: 'Balkenfarbe',
    settingBarColorDesc: 'Leer lassen, um dem Theme zu folgen. Jede CSS-Farbe funktioniert.',
    settingActiveColorName: 'Farbe des aktiven Balkens',
    settingActiveColorDesc: 'Farbe des Balkens an der aktuellen Position. Leer folgt der Akzentfarbe des Themes.',
    settingGradientName: 'Farbverlauf',
    settingGradientDesc: 'Die Balken entlang der Leiste von einer Farbe in eine andere übergehen lassen. Überschreibt die Balkenfarbe oben.',
    settingGradientStartName: 'Verlaufsanfang',
    settingGradientEndName: 'Verlaufsende',
    settingPreviewToggleName: 'Vorschau anzeigen',
    settingPreviewToggleDesc: 'Eine kleine Karte mit der Überschrift und dem Anfang ihres Textes, beim Hovern angezeigt.',
    optPreviewOff: 'Nicht anzeigen',
    optPreviewBars: 'Auf den Balken',
    optPreviewOutline: 'Auf der Gliederung',
    settingPreviewLenName: 'Vorschaulänge',
    settingPreviewLenDesc: 'Wie viele Zeichen des Abschnittstextes angezeigt werden.',
    errWriteConflict: 'die Datei wurde während des Vorgangs geändert, bitte erneut versuchen',
    noticeModifyFail: (msg) => 'Heading Rail: ' + (msg || 'Datei konnte nicht geändert werden'),
    consoleFallbackCss: '[Heading Rail] styles.css nicht neben main.js gefunden — eingebaute Kopie wird verwendet.',
    consoleStyleCheckFail: '[Heading Rail] Stile konnten nicht überprüft werden:',
    consoleBuildFail: '[Heading Rail] Fehler beim Aufbau der Oberfläche:',
    trashNoTitle: '(ohne Titel)',
    trashMeta: (lines, path, when) => lines + ' Zeilen · ' + path + ' · ' + when,
    settingLanguageName: 'Sprache',
    settingLanguageDesc: 'Sprache der Oberfläche dieses Plugins. Automatisch richtet sich nach der Einstellung von Obsidian.',
    optLanguageAuto: 'Automatisch',
    profileDesktop: 'Computer',
    profileMobile: 'Smartphone',
    mobileProfileHint: 'Diese Einstellungen gelten nur auf Smartphones und Tablets. Mit der Kettenschaltfläche neben einer Einstellung übernimmt sie stattdessen den Wert vom Computer.',
    linkToDesktop: 'Wert vom Computer übernehmen',
    unlinkFromDesktop: 'Eigenen Wert für das Smartphone setzen',
    resetToTheme: 'Zurück zur Themenfarbe',
    settingAnchorName: 'Ausrichtung in der Höhe',
    settingAnchorDesc: 'Wo die Striche entlang der Höhe der Notiz sitzen.',
    optAnchorCenter: 'Mittig',
    optAnchorTop: 'Oben',
    optAnchorBottom: 'Unten',
    settingSpacingMinName: 'Kleinster Abstand',
    settingSpacingMinDesc: 'Näher als das rücken die Striche nie zusammen.',
    settingSpacingMaxName: 'Größter Abstand',
    settingSpacingMaxDesc: 'Weiter als das gehen die Striche nie auseinander, auch nicht in einer kurzen Notiz.',
    settingThicknessName: 'Strichstärke',
    settingThicknessDesc: 'Wie dick jeder Strich ist, in Pixeln.',
    settingBarWidthName: 'Strichlänge',
    settingBarWidthDesc: 'Länge der Striche in Ruhe, in Prozent des Standardwerts für die jeweilige Überschriftenebene.',
    settingsSectionWave: 'Welle',
    settingsSectionWaveFine: 'Welle — Feinabstimmung',
    settingsSectionBars: 'Striche',
    settingsSectionLevels: 'Länge nach Überschriftenebene',
    settingsSectionGlow: 'Positionshervorhebung',
    waveIntro: 'Jeder Strich bekommt pro Bild eine einzige Zahl: wie stark die Welle ihn erreicht. Jede Eigenschaft unten wandert entlang dieser Zahl von ihrem Ruhewert zu ihrem Spitzenwert. So gibt es Länge ohne Farbe, Farbe ohne Länge oder beides zugleich.',
    levelsHint: 'Länge eines Strichs in Ruhe, in Pixeln, bevor der gemeinsame Faktor von oben angewendet wird.',
    settingPeakModeName: 'Länge an der Spitze',
    settingPeakModeDesc: 'Gemeinsame Länge zieht alle Striche zur selben Länge, dann wird der Kamm der Welle gleichmäßig. Zuwachs gibt jedem Strich denselben Zuschlag zu seiner eigenen Länge, dann bleiben tiefere Ebenen kürzer.',
    optPeakTarget: 'Gemeinsame Länge',
    optPeakAdd: 'Zuwachs zur eigenen',
    settingPeakLengthName: 'Länge in der Mitte',
    settingPeakLengthDesc: 'Wie lang ein Strich genau in der Mitte der Welle wird, in Pixeln.',
    settingPeakAddName: 'Zuwachs in der Mitte',
    settingPeakAddDesc: 'Wie viele Pixel ein Strich genau in der Mitte der Welle dazubekommt.',
    settingCurveName: 'Form der Welle',
    settingCurveDesc: 'Wie die Stärke von der Mitte der Welle zu den Rändern abfällt.',
    optCurveBell: 'Glocke — weich, ohne sichtbare Kante',
    optCurvePeak: 'Spitze — scharfe Mitte, lange Ausläufer',
    optCurvePlateau: 'Plateau — flache Kuppe, steile Flanken',
    optCurveCosine: 'Bogen — gleichmäßig, mit sauberer Kante',
    optCurveWedge: 'Keil — gerader Abfall',
    optCurveStep: 'Stufe — ganz oder gar nicht',
    optCurveRipple: 'Nachhall — eine zweite, schwächere Welle dahinter',
    settingEdgeName: 'Schärfe der Ränder',
    settingEdgeDesc: 'Feinabstimmung der gewählten Form: höhere Werte machen sie schmaler und die Ränder härter. Bogen, Keil und Stufe achten nicht darauf.',
    settingPeakBrightName: 'Helligkeit an der Spitze',
    settingPeakBrightDesc: 'Wie viel Wellenfarbe in einem Strich in der Mitte der Welle steckt. Null lässt die Farbe in Ruhe, dann ändert sich nur die Länge.',
    settingRestBrightName: 'Helligkeit in Ruhe',
    settingRestBrightDesc: 'Wie viel Wellenfarbe alle Striche tragen, solange die Welle fort ist.',
    settingWaveColorName: 'Farbe der Welle',
    settingWaveColorDesc: 'Die Farbe, die die Welle in die Striche mischt. Standardmäßig die Textfarbe Ihres Themes.',
    settingRestOpacityName: 'Deckkraft in Ruhe',
    settingRestOpacityDesc: 'Wie kräftig die Striche sind, solange die Welle fort ist.',
    settingPeakOpacityName: 'Deckkraft an der Spitze',
    settingPeakOpacityDesc: 'Wie kräftig ein Strich in der Mitte der Welle ist.',
    settingPeakThickName: 'Dicke an der Spitze',
    settingPeakThickDesc: 'Dicke eines Strichs in der Mitte der Welle, in Prozent seiner Dicke in Ruhe. Bei 100 bleibt die Dicke gleich.',
    settingFollowName: 'Nachlaufzeit',
    settingFollowDesc: 'Wie lange die Welle braucht, um den Zeiger einzuholen, in Millisekunden. Null heftet sie genau an den Zeiger.',
    settingOvershootName: 'Überschwingen',
    settingOvershootDesc: 'Wie weit die Welle bei schneller Bewegung über den Zeiger hinausschießt, bevor sie zurückkommt. Null kommt an und bleibt stehen.',
    settingRiseName: 'Anstieg',
    settingRiseDesc: 'Wie lange die Welle braucht, um auf volle Stärke zu kommen, wenn der Zeiger eintrifft.',
    settingFallName: 'Abklingen',
    settingFallDesc: 'Wie lange die Welle braucht, um zu verschwinden, nachdem der Zeiger weg ist. Null lässt sie sofort einrasten.',
    settingLevelWidthName: (n) => 'Überschrift Ebene ' + n,
    settingCapWidthName: 'Endmarken',
    settingCapWidthDesc: 'Länge der beiden kurzen Striche für Anfang und Ende der Notiz.',
    optGlowOff: 'Aus',
    settingReachName: 'Reichweite der Welle',
    settingReachDesc: 'Wie weit sich die Welle vom Zeiger ausbreitet, gemessen in Strichen.',
    settingHorizontalName: 'Auf seitliche Bewegung reagieren',
    settingHorizontalDesc: 'Die Striche wachsen zusätzlich, je weiter sich der Zeiger vom Rand weg zur Seite bewegt.',
    settingHorizontalRangeName: 'Seitliche Strecke',
    settingHorizontalRangeDesc: 'Wie weit der Zeiger vom Rand weg muss, damit die Striche ihre volle Länge erreichen.',
    settingPreviewTriggerName: 'Vorschau auslösen über',
    settingPreviewTriggerDesc: 'Welcher Teil der Anzeige die Vorschaukarte hervorholt.',
    optTriggerBoth: 'Striche und Gliederung',
    settingPreviewPlaceName: 'Position der Vorschau',
    settingPreviewPlaceDesc: 'Automatisch rückt die Karte neben die geöffnete Gliederung, damit sie die Liste nie verdeckt.',
    optPlaceAuto: 'Automatisch',
    optPlaceRail: 'Neben den Strichen',
    optPlaceOutline: 'Neben der Gliederung',
    settingPreviewBgName: 'Hintergrund der Vorschau',
    settingIntensityName: 'Ausdruck der Welle',
    settingIntensityDesc: 'Ein Regler über allen anderen: Er zieht Länge, Helligkeit, Deckkraft, Dicke und — schwächer — auch die Reichweite zugleich. Auf null reagieren die Striche gar nicht mehr. Alles darunter beschreibt den Charakter der Welle, dieser Regler nur die Lautstärke.',
    settingRailFromName: 'Schiene beginnt bei',
    settingRailFromDesc: 'Oberer Rand der Schiene, in Prozent der Höhe der Notiz.',
    settingRailToName: 'Schiene endet bei',
    settingRailToDesc: 'Unterer Rand der Schiene, in Prozent der Höhe der Notiz. Zusammen mit der Einstellung darüber ergibt sich das Band, in dem die Striche leben — und die Ausrichtung in der Höhe entscheidet, wo sie darin sitzen, wenn es zu wenige sind, um es zu füllen.',
    panelWaveHint: 'An der Spitze ist ein Strich länger als die Schiene und würde bei geöffneter Gliederung quer über der Liste liegen. Diese beiden Schalter sagen, ob die Striche in diesem Zustand stillstehen; bewegen sie sich doch, rückt die Gliederung genau um das zur Seite, was die Striche beanspruchen.',
    settingWavePinnedName: 'Bewegen, während die Gliederung fixiert ist',
    settingWavePinnedDesc: 'Aus hält die Striche auf ihrer Ruhelänge, solange die Gliederung fixiert offen steht.',
    settingWavePeekName: 'Bewegen, während Strg gehalten wird',
    settingWavePeekDesc: 'Aus hält die Striche still, während die Gliederung mit Strg nur kurz eingeblendet ist.',
    linkedNote: 'Nimmt gerade den Wert vom Computer — die Kettenschaltfläche gibt dem Smartphone einen eigenen.',
    settingPreviewGapName: 'Abstand zu den Strichen',
    settingPreviewGapDesc: 'Abstand zwischen Schiene und Vorschaukarte, in Pixeln. Der Platz, den die Striche an ihrer Spitze brauchen, kommt automatisch obendrauf, damit der längste Strich nie auf der Karte liegt.',
    settingPreviewWidthName: 'Breite der Karte',
    settingPreviewWidthDesc: 'Breite der Vorschaukarte in Pixeln, begrenzt durch die Fensterbreite.',
    settingsSectionPreviewType: 'Schrift der Vorschau',
    previewTypeHint: 'Die ersten drei Schriften sind die in Obsidian selbst eingestellten. So passt die Karte zur Notiz oder zur Oberfläche, ohne dass Sie etwas aussuchen müssen.',
    optFontInterface: 'Oberflächenschrift von Obsidian',
    optFontText: 'Textschrift von Obsidian',
    optFontMono: 'Festbreitenschrift von Obsidian',
    optFontSystem: 'System',
    optFontSans: 'Serifenlos',
    optFontSerif: 'Mit Serifen',
    optFontSlab: 'Mit kantigen Serifen',
    optFontMonospace: 'Feste Breite',
    settingPreviewTitleFontName: 'Schrift der Überschrift',
    settingPreviewTitleSizeName: 'Größe der Überschrift',
    settingPreviewTitleWeightName: 'Stärke der Überschrift',
    settingPreviewTextFontName: 'Schrift des Textes',
    settingPreviewTextSizeName: 'Größe des Textes',
    settingPreviewTextWeightName: 'Stärke des Textes',
    settingPreviewLineName: 'Zeilenabstand',
    settingPreviewLineDesc: 'Zeilenhöhe des Vorschautexts, in Prozent seiner Schriftgröße.',
    settingSpanName: 'Striche in der Welle',
    settingSpanDesc: (span, side) => 'Immer ungerade: ein Strich in der Mitte und je ' + side + ' auf jeder Seite. Zurzeit ' + span + '.',
    settingsSectionSteps: 'Länge jeder Stufe',
    stepsHint: 'Jeder Regler ist die Länge eines Strichs in Pixeln bei voller Wellenstärke. Die Mitte ist der Strich unter dem Zeiger, die übrigen spiegeln sich darüber und darunter.',
    settingStepCenterName: 'Mittlerer Strich',
    settingStepName: (d) => 'Strich ' + d + ' weiter',
    settingSharpName: 'Klare Mitte',
    settingSharpDesc: 'Der Strich, der dem Zeiger am nächsten ist, erreicht immer die volle Länge, alle übrigen bleiben strikt kürzer. Ohne das teilen sich die beiden Striche, zwischen denen der Zeiger steht, die Stärke, und ein Nachbar kann länger werden als der, auf den Sie zeigen.',
    settingReactZoneName: 'Reaktionszone',
    settingReactZoneDesc: 'Ab welchem Abstand zur Schiene die Striche zu reagieren beginnen, in Pixeln. Am äußeren Rand der Zone läuft die Stärke sanft auf null aus, so kommt die Welle dem Zeiger entgegen, statt plötzlich da zu sein. Null heißt: die Striche reagieren erst, wenn der Zeiger über der Schiene selbst steht.',
    settingHorizontalMinName: 'Stärke ganz am Rand',
    settingHorizontalMinDesc: 'Wie stark die Welle ist, wenn der Zeiger direkt am Fensterrand klebt, in Prozent der vollen Stärke. Kleinere Werte lassen die Schiene zurückhaltend wirken, bis Sie sich zum Text hin bewegen.',
    settingCapsModeName: 'Endmarken',
    settingCapsModeDesc: 'Die beiden kurzen Striche für Anfang und Ende der Notiz.',
    optCapsOn: 'Sichtbar und anklickbar',
    optCapsQuiet: 'Sichtbar, aber nicht anklickbar',
    optCapsOff: 'Ganz entfernen',
    optCurveCustom: 'Eigene Form, in Pixeln',
    settingCenterModeName: 'Wo die Welle ihre Mitte hat',
    settingCenterModeDesc: 'Auf einem Strich — der leere Raum zwischen den Strichen wird genau halbiert; solange der Zeiger über einem Strich bleibt, bewegt sich überhaupt nichts. Überschreiten Sie die Mitte, rutscht die Welle zum nächsten Strich, genauso weich, wie sie dem Zeiger folgen würde. Frei — die Mitte sitzt genau unter dem Zeiger, die beiden Striche daneben teilen sich die Welle und verschieben sich bei jeder kleinen Bewegung.',
    optCenterSnap: 'Auf einem Strich',
    optCenterFree: 'Frei, unter dem Zeiger',
    settingRailEdgeName: 'Abstand zum Fensterrand',
    settingRailEdgeDesc: 'Wie weit die ganze Schiene vom Rand der Notiz weggerückt wird, in Pixeln.',
    settingColGapName: 'Abstand zwischen den Spalten',
    settingColGapDesc: 'Platz zwischen den Strichspalten bei Notizen, die für eine Spalte zu lang sind, in Pixeln.',
    settingLevelThickName: (n) => 'Ebene ' + n + ' — Dicke',
    settingLevelFadeName: (n) => 'Ebene ' + n + ' — Deckkraft',
    settingGlowLiftName: 'Hervorhebung holt Striche nach vorn',
    settingGlowLiftDesc: 'Wie weit die Hervorhebung einen Strich zur vollen Deckkraft zieht, in Prozent. Ohne das wurde die Hervorhebung mit der allgemeinen Deckkraft multipliziert und verschwand fast — es sah so aus, als leuchte immer nur der aktuelle Strich.',
    settingGlowColorName: 'Farbe der Hervorhebung',
    settingGlowColorDesc: 'Farbe der Positionshervorhebung. Standardmäßig die Farbe der aktuellen Überschrift.',
    settingsSectionPresets: 'Fertige Stile',
    presetsHint: 'Ein Stil ist ein Satz Werte, der auf einmal übernommen wird. Aussuchen, anwenden und von dort aus weiter nachjustieren — nichts ist festgeschrieben. Stile, die andere Leute einschicken, kommen hierher, nachdem der Autor sie angesehen hat.',
    settingPresetName: 'Stil',
    settingPresetDesc: 'Gilt für das Profil, das Sie gerade bearbeiten. Alles, was der Stil nicht erwähnt, bleibt so, wie Sie es hatten.',
    presetApply: 'Anwenden',
    presetApplied: (name) => 'Stil übernommen: ' + name,
    settingShareName: 'Eigenen Stil weitergeben',
    settingShareDesc: 'Wenn dabei etwas herausgekommen ist, das Ihnen gefällt, können Sie es einschicken. Geprüfte Stile kommen in einer späteren Version in die Liste.',
    shareOpen: 'Weitergeben…',
    shareTitle: 'Eigenen Stil weitergeben',
    shareIntro: 'Unten stehen die Werte, die Sie gerade verwenden. Kopieren Sie sie und schicken Sie sie per E-Mail. Von allein geht nichts irgendwohin — das Plugin öffnet nur Ihr Mailprogramm mit fertigem Brief.',
    shareCopy: 'Einstellungen kopieren',
    shareCopied: 'Einstellungen in die Zwischenablage kopiert',
    shareCopyManual: 'Kopieren Sie den markierten Text von Hand',
    shareMail: 'E-Mail öffnen',
    shareSubject: 'Heading Rail — ein Stil zur Ansicht',
    shareBody: 'Fügen Sie die kopierten Einstellungen unter dieser Zeile ein und schreiben Sie dazu, wie der Stil heißen soll, falls Sie einen Namen haben.\n\n',
    shareNote: 'Mitgeschickt werden nur die Werte der Plugin-Einstellungen. Kein Notiztext, keine Dateinamen, nichts anderes aus Ihrem Tresor.',
    contactLine: 'Ideen für dieses Plugin oder für ein anderes? Schreiben Sie dem Autor:',
    settingPreviewTitleColorName: 'Farbe der Überschrift',
    settingPreviewTextColorName: 'Farbe des Textes',
    settingsSectionPanelLook: 'Farben der Gliederung',
    settingPanelBgName: 'Hintergrund der Gliederung',
    settingPanelTextName: 'Text der Gliederung',
    settingPanelActiveTextName: 'Aktueller Eintrag',
    presetBase: 'Base',
    glowHint: 'Zwei getrennte Dinge, jedes für sich einschaltbar: der aktuelle Strich und der Hof um ihn herum. Der Hof wird genauso eingestellt wie die Strichlängen — wie viele Striche er erfasst und wie hell jede Stufe ist, nach oben und unten gleich.',
    settingActiveGlowName: 'Aktuellen Strich hervorheben',
    settingActiveGlowDesc: 'Der Strich der Überschrift, in der Sie sich gerade befinden.',
    optGlowAlways: 'Immer',
    optGlowHover: 'Nur beim Zeigen auf die Schiene',
    optGlowTouch: 'Nur solange der Finger auf der Schiene liegt',
    settingHaloModeName: 'Hof darum herum',
    settingHaloModeDesc: 'Die Nachbarn des aktuellen Strichs, die mit dem Abstand verblassen.',
    settingHaloSpanName: 'Striche im Hof',
    settingHaloSpanDesc: (span, side) => 'Immer ungerade: der aktuelle Strich und je ' + side + ' auf jeder Seite. Zurzeit ' + span + '.',
    settingsSectionHaloSteps: 'Helligkeit jeder Stufe',
    haloStepsHint: 'Wie hell ein Strich in jedem Abstand zum aktuellen ist, in Prozent. Stufe eins ist der unmittelbare Nachbar, dieselben Werte gelten nach oben wie nach unten.',
    settingHaloStepName: (d) => 'Stufe ' + d,
    colourHint: 'Jede Farbe steht in derselben Zeile wie ihre eigene Deckkraft, und der Pfeil rechts gibt sie Ihrem Theme zurück.',
    settingCapThickName: 'Endmarken — Dicke',
    settingCapOpacityName: 'Endmarken — Deckkraft',
    settingPanelGapName: 'Abstand zu den Strichen',
    settingPanelGapDesc: 'Abstand zwischen der Schiene und der Gliederungsliste, in Pixeln.',
    settingsSectionPreviewLook: 'Farben der Vorschau',
    settingMobileOnName: 'Plugin auf diesem Smartphone verwenden',
    settingMobileOnDesc: 'Obsidian hat am Bildschirmrand eine eigene Wischgeste, und die kommt der Schiene in die Quere. Wenn das Smartphone dadurch mehr Mühe als Nutzen macht, schalten Sie das Plugin hier ab — auf dem Computer läuft alles weiter wie zuvor.',
    mobileOffHint: 'Die Schiene ist auf Smartphones abgeschaltet. Die übrigen Smartphone-Einstellungen sind ausgeblendet, weil hier ohnehin nichts davon etwas bewirken würde.',
    settingFollowThemeName: 'Dem Theme folgen',
    settingFollowThemeDesc: 'Farben aus einem fertigen Stil werden so nachgezogen, dass nie Helles auf Hellem oder Dunkles auf Dunklem landet: Der Autor des Stils hat sie für sein Theme ausgesucht, nicht für Ihres. Farben, die Sie selbst setzen, werden nie angefasst — auch wenn sie dem Hintergrund nahekommen.',
    settingRadiusName: 'Abrundung der Ecken',
    settingRadiusDesc: 'Ein Wert für alles, was das Plugin zeichnet: die Vorschaukarte, die Gliederungsliste und das Suchfeld.',
    settingActiveMoveName: 'Wenn der aktuelle Strich wechselt',
    settingActiveMoveDesc: 'Sprung — die Hervorhebung ist sofort am neuen Ort. Fahrt — sie fährt dorthin und zieht eine verblassende Spur hinter sich her. Der Sprung über die halbe Schiene ist es, was beim Klicken in der Gliederung so abrupt wirkt.',
    optMoveTravel: 'Fährt zum neuen Ort',
    optMoveInstant: 'Springt sofort hin',
    settingTravelTimeName: 'Dauer der Fahrt',
    settingTravelTimeDesc: 'Wie lange die Hervorhebung bis zum Ziel braucht, in Millisekunden.',
    settingTravelOvershootName: 'Überschwingen beim Ankommen',
    settingTravelOvershootDesc: 'Wie weit sie über das Ziel hinausschwingt, bevor sie stehen bleibt.',
    settingTravelTrailName: 'Spur unterwegs',
    settingTravelTrailDesc: 'Wie hell die Striche aufleuchten, an denen sie vorbeikommt. Null ergibt eine schlichte Fahrt ohne Spur.',
    shareNameName: 'Name des Stils',
    shareNameDesc: 'Freiwillig. Kommt in den Brief, damit der Stil einen Namen hat.',
    shareNamePlaceholder: 'zum Beispiel: Nachtlineal',
    shareWhichName: 'Was verschickt wird',
    shareWhichDesc: 'Jeder Satz ist im Brief beschriftet, so werden Computer und Smartphone nie verwechselt.',
    shareBoth: 'Beide — Computer und Smartphone',
    presetStateOn: (name) => 'Zurzeit aktiv: ' + name + '.',
    presetStateChanged: (name) => 'Zurzeit aktiv: ' + name + ', mit Ihren eigenen Änderungen darüber.',
    presetRestore: 'Stil zurückholen',
    settingScrollToName: 'Wo die Überschrift landet',
    settingScrollToDesc: 'Wenn Sie über die Schiene oder die Gliederung zu einer Überschrift springen — an welcher Stelle des Bildschirms sie dann steht.',
    optScrollTop: 'Oben',
    optScrollUpper: 'Auf einem Drittel der Höhe',
    optScrollCenter: 'In der Mitte',
    contributeLine: 'Einen Fork gebaut, der wirklich besser ist? Schicken Sie mir den Quellcode und wie Sie es umgesetzt haben. Wenn es tatsächlich besser ist, kommt es in die nächste Version und Sie werden als Mitautor genannt. Ich behalte mir vor, Ihren Code umzubauen — diente er aber als Grundlage, werden Sie trotzdem genannt.',
  },
  fr: {
    tocTooltip: 'Structure de la note',
    trashTooltip: 'Historique des sections',
    searchPlaceholder: 'Rechercher dans la structure',
    startOfDoc: 'Début du document',
    endOfDoc: 'Fin du document',
    jumpAboveLabel: "La position actuelle est au-dessus — l'afficher",
    jumpBelowLabel: "La position actuelle est en dessous — l'afficher",
    delete: 'Supprimer',
    deleteN: (n) => 'Supprimer (' + n + ')',
    copy: 'Copier',
    copyN: (n) => 'Copier (' + n + ')',
    copyAgain: 'Copier à nouveau',
    cancel: 'Annuler',
    restore: 'Restaurer',
    forget: 'Oublier',
    historyTitle: 'Historique des sections',
    trashCopiedHead: 'Copié',
    trashCopiedEmpty: "Rien copié pour l'instant.",
    trashDeletedHead: 'Supprimé',
    trashDeletedEmpty: "Rien supprimé pour l'instant.",
    trashHint: "Les plus récents en premier. Si le fichier a été modifié après une suppression, restaurez d'abord les entrées les plus récentes.",
    settingSearchName: 'Champ de recherche',
    settingSearchDesc: 'Afficher un champ de recherche à côté de la structure développée.',
    settingSearchBottomName: 'Recherche en bas',
    settingSearchBottomDesc: 'Inverser les positions : recherche sous la structure, structure au-dessus.',
    settingTrashMaxName: 'Conserver les suppressions',
    settingTrashMaxDesc: "Combien d'entrées conserver dans la liste des sections supprimées.",
    cmdDeleteSelected: 'Supprimer les sections sélectionnées',
    cmdCopySelected: 'Copier les sections sélectionnées',
    cmdRestoreLast: 'Restaurer la dernière suppression',
    noticeReadFail: 'Heading Rail : impossible de lire le fichier',
    noticeStale: 'La structure est obsolète — actualisez la liste et réessayez',
    noticeDeleted: (sections, lines) => 'Sections supprimées : ' + sections + ', lignes : ' + lines,
    noticeNothingToRestore: 'Rien à restaurer',
    noticeFileNotFound: 'Fichier introuvable',
    noticeReadFail2: 'Impossible de lire le fichier',
    noticeChangedAfterDelete: "Le fichier a changé après cette suppression. Restaurez d'abord les entrées les plus récentes, ou utilisez Ctrl+Z.",
    noticeRestored: 'Suppression restaurée',
    noticeCopied: (sections, lines) => 'Sections copiées : ' + sections + ', lignes : ' + lines,
    noticeCopyFail: 'Impossible de copier dans le presse-papiers',
    noticeRestoreFail: (msg) => 'Impossible de restaurer : ' + msg,
    settingsSectionLayout: 'Disposition',
    settingsSectionColour: 'Couleur',
    settingsSectionPreview: 'Aperçu au survol',
    settingsSectionOutline: 'Structure',
    settingSideName: 'Côté',
    settingSideDesc: 'Le bord de la note auquel les barres sont ancrées.',
    optRight: 'Droite',
    optLeft: 'Gauche',
    settingSpacingName: 'Espacement entre les barres',
    settingSpacingDesc: "Adaptatif répartit les barres sur la hauteur disponible. Fixe conserve le même espacement quel que soit le nombre de titres.",
    optAdaptive: 'Adaptatif',
    optFixed: 'Fixe',
    settingFixedSpacingName: 'Espacement fixe',
    settingFixedSpacingDesc: 'Écart entre les barres, en pixels.',
    settingHoverScrollName: 'Défilement au survol',
    settingHoverScrollDesc: 'Faire défiler le document quand le curseur passe sur les barres, sans cliquer.',
    settingBarColorName: 'Couleur des barres',
    settingBarColorDesc: 'Laisser vide pour suivre le thème. Toute couleur CSS fonctionne.',
    settingActiveColorName: 'Couleur de la barre active',
    settingActiveColorDesc: "Couleur de la barre marquant la position actuelle. Vide suit la couleur d'accent du thème.",
    settingGradientName: 'Dégradé',
    settingGradientDesc: "Faire passer les barres d'une couleur à une autre le long de la barre. Remplace la couleur définie ci-dessus.",
    settingGradientStartName: 'Début du dégradé',
    settingGradientEndName: 'Fin du dégradé',
    settingPreviewToggleName: "Afficher l'aperçu",
    settingPreviewToggleDesc: "Une petite fiche avec le titre et le début de son texte, affichée au survol.",
    optPreviewOff: 'Ne pas afficher',
    optPreviewBars: 'Sur les barres',
    optPreviewOutline: 'Sur la structure',
    settingPreviewLenName: "Longueur de l'aperçu",
    settingPreviewLenDesc: 'Combien de caractères du texte de la section afficher.',
    errWriteConflict: "le fichier a changé pendant l'opération, veuillez réessayer",
    noticeModifyFail: (msg) => 'Heading Rail : ' + (msg || 'impossible de modifier le fichier'),
    consoleFallbackCss: "[Heading Rail] styles.css introuvable à côté de main.js — copie intégrée utilisée.",
    consoleStyleCheckFail: '[Heading Rail] impossible de vérifier les styles :',
    consoleBuildFail: "[Heading Rail] erreur lors de la construction de l'interface :",
    trashNoTitle: '(sans titre)',
    trashMeta: (lines, path, when) => lines + ' lignes · ' + path + ' · ' + when,
    settingLanguageName: 'Langue',
    settingLanguageDesc: "Langue de l'interface de ce greffon. Automatique suit le réglage d'Obsidian.",
    optLanguageAuto: 'Automatique',
    profileDesktop: 'Ordinateur',
    profileMobile: 'Téléphone',
    mobileProfileHint: "Ces réglages ne valent que sur téléphones et tablettes. Le bouton en forme de maillon, à côté d'un réglage, lui fait reprendre la valeur de l'ordinateur.",
    linkToDesktop: "Reprendre la valeur de l'ordinateur",
    unlinkFromDesktop: 'Donner au téléphone sa propre valeur',
    resetToTheme: 'Revenir à la couleur du thème',
    settingAnchorName: 'Ancrage en hauteur',
    settingAnchorDesc: 'Où les barres se placent sur la hauteur de la note.',
    optAnchorCenter: 'Au centre',
    optAnchorTop: 'En haut',
    optAnchorBottom: 'En bas',
    settingSpacingMinName: 'Écart minimal',
    settingSpacingMinDesc: 'Les barres ne se rapprochent jamais plus que cela.',
    settingSpacingMaxName: 'Écart maximal',
    settingSpacingMaxDesc: "Les barres ne s'écartent jamais plus que cela, même dans une note courte.",
    settingThicknessName: 'Épaisseur des barres',
    settingThicknessDesc: 'Épaisseur de chaque barre, en pixels.',
    settingBarWidthName: 'Longueur des barres',
    settingBarWidthDesc: 'Longueur des barres au repos, en pourcentage de la valeur par défaut de chaque niveau de titre.',
    settingsSectionWave: 'Vague',
    settingsSectionWaveFine: 'Vague — réglage fin',
    settingsSectionBars: 'Barres',
    settingsSectionLevels: 'Longueur par niveau de titre',
    settingsSectionGlow: 'Mise en évidence de la position',
    waveIntro: "À chaque image, chaque barre reçoit un seul nombre : la force avec laquelle la vague l'atteint. Chaque propriété ci-dessous parcourt ce nombre depuis sa valeur au repos jusqu'à sa valeur au sommet. On obtient ainsi de la longueur sans couleur, de la couleur sans longueur, ou les deux à la fois.",
    levelsHint: "Longueur d'une barre au repos, en pixels, avant le multiplicateur commun réglé plus haut.",
    settingPeakModeName: 'Longueur au sommet',
    settingPeakModeDesc: "Longueur commune tire toutes les barres vers la même longueur, la crête de la vague devient alors régulière. Ajout donne à chaque barre le même supplément par-dessus la sienne, les niveaux profonds restent donc plus courts.",
    optPeakTarget: 'Longueur commune',
    optPeakAdd: 'Ajout à la sienne',
    settingPeakLengthName: 'Longueur au centre',
    settingPeakLengthDesc: 'Longueur atteinte par une barre au centre même de la vague, en pixels.',
    settingPeakAddName: 'Supplément au centre',
    settingPeakAddDesc: 'Nombre de pixels ajoutés à une barre au centre même de la vague.',
    settingCurveName: 'Forme de la vague',
    settingCurveDesc: 'Comment la force retombe depuis le centre de la vague.',
    optCurveBell: 'Cloche — douce, sans bord visible',
    optCurvePeak: 'Pointe — centre net, longues traînes',
    optCurvePlateau: 'Plateau — sommet plat, flancs raides',
    optCurveCosine: 'Arc — courbe régulière, bord net',
    optCurveWedge: 'Coin — chute droite',
    optCurveStep: 'Marche — tout ou rien',
    optCurveRipple: 'Ondulation — une seconde vague, plus faible, derrière',
    settingEdgeName: 'Netteté des bords',
    settingEdgeDesc: "Réglage fin de la forme choisie : plus la valeur est grande, plus elle se resserre et plus les bords sont durs. L'arc, le coin et la marche n'en tiennent pas compte.",
    settingPeakBrightName: 'Clarté au sommet',
    settingPeakBrightDesc: "Quantité de couleur de la vague mêlée à une barre au centre de la vague. À zéro la couleur est laissée tranquille et seule la longueur bouge.",
    settingRestBrightName: 'Clarté au repos',
    settingRestBrightDesc: "Quantité de couleur de la vague que portent toutes les barres tant que la vague est absente.",
    settingWaveColorName: 'Couleur de la vague',
    settingWaveColorDesc: "La couleur que la vague mêle aux barres. Par défaut, celle du texte de votre thème.",
    settingRestOpacityName: 'Opacité au repos',
    settingRestOpacityDesc: 'Densité des barres tant que la vague est absente.',
    settingPeakOpacityName: 'Opacité au sommet',
    settingPeakOpacityDesc: "Densité d'une barre au centre de la vague.",
    settingPeakThickName: 'Épaisseur au sommet',
    settingPeakThickDesc: "Épaisseur d'une barre au centre de la vague, en pourcentage de son épaisseur au repos. À 100 l'épaisseur ne change pas.",
    settingFollowName: 'Temps de rattrapage',
    settingFollowDesc: 'Temps que met la vague pour rejoindre le curseur, en millisecondes. À zéro elle y est épinglée.',
    settingOvershootName: 'Dépassement',
    settingOvershootDesc: "De combien la vague dépasse le curseur lors d'un mouvement vif avant de revenir. À zéro elle arrive et s'arrête.",
    settingRiseName: 'Montée',
    settingRiseDesc: 'Temps que met la vague pour atteindre sa pleine force à l’arrivée du curseur.',
    settingFallName: 'Extinction',
    settingFallDesc: "Temps que met la vague pour s'éteindre après le départ du curseur. À zéro elle disparaît d'un coup.",
    settingLevelWidthName: (n) => 'Titre de niveau ' + n,
    settingCapWidthName: 'Repères des extrémités',
    settingCapWidthDesc: 'Longueur des deux courtes barres marquant le début et la fin de la note.',
    optGlowOff: 'Désactivé',
    settingReachName: 'Portée de la vague',
    settingReachDesc: 'Jusqu’où la vague s’étend depuis le curseur, mesuré en barres.',
    settingHorizontalName: 'Réagir au déplacement latéral',
    settingHorizontalDesc: 'Les barres grandissent aussi à mesure que le curseur s’éloigne du bord vers le texte.',
    settingHorizontalRangeName: 'Distance latérale',
    settingHorizontalRangeDesc: 'Distance que le curseur doit parcourir depuis le bord pour que les barres atteignent leur pleine longueur.',
    settingPreviewTriggerName: 'Afficher l’aperçu depuis',
    settingPreviewTriggerDesc: 'Quelle partie de l’affichage fait apparaître la carte d’aperçu.',
    optTriggerBoth: 'Barres et plan',
    settingPreviewPlaceName: 'Position de l’aperçu',
    settingPreviewPlaceDesc: 'Automatique place la carte à côté du plan tant qu’il est ouvert, pour qu’elle ne recouvre jamais la liste.',
    optPlaceAuto: 'Automatique',
    optPlaceRail: 'À côté des barres',
    optPlaceOutline: 'À côté du plan',
    settingPreviewBgName: 'Fond de l’aperçu',
    settingIntensityName: 'Ampleur de la vague',
    settingIntensityDesc: "Un curseur au-dessus de tous les autres : il tire à la fois la longueur, la clarté, l'opacité, l'épaisseur et, plus doucement, la portée. À zéro les barres cessent complètement de réagir. Tout ce qui suit décrit le caractère de la vague, celui-ci ne dit que le volume.",
    settingRailFromName: 'Le rail commence à',
    settingRailFromDesc: 'Bord supérieur du rail, en pourcentage de la hauteur de la note.',
    settingRailToName: 'Le rail finit à',
    settingRailToDesc: "Bord inférieur du rail, en pourcentage de la hauteur de la note. Avec le réglage précédent, cela découpe la bande où vivent les barres — et l'ancrage en hauteur décide où elles se placent à l'intérieur quand elles sont trop peu nombreuses pour la remplir.",
    panelWaveHint: "Au sommet, une barre est plus longue que le rail : le plan ouvert, elle s'étalerait en travers de la liste. Ces deux interrupteurs disent si les barres restent immobiles dans cet état ; si elles bougent quand même, le plan s'écarte exactement de ce que les barres prennent.",
    settingWavePinnedName: 'Animer quand le plan est épinglé',
    settingWavePinnedDesc: 'Désactivé garde les barres à leur longueur de repos tant que le plan reste épinglé.',
    settingWavePeekName: 'Animer pendant l’appui sur Ctrl',
    settingWavePeekDesc: 'Désactivé garde les barres immobiles pendant qu’on entrouvre le plan avec Ctrl.',
    linkedNote: "Reprend pour l'instant la valeur de l'ordinateur — le bouton en forme de maillon donne au téléphone la sienne.",
    settingPreviewGapName: 'Distance aux barres',
    settingPreviewGapDesc: "Espace entre le rail et la carte d'aperçu, en pixels. La place prise par les barres à leur sommet s'y ajoute d'elle-même, pour que la plus longue ne se couche jamais sur la carte.",
    settingPreviewWidthName: 'Largeur de la carte',
    settingPreviewWidthDesc: "Largeur de la carte d'aperçu en pixels, limitée par la largeur de la fenêtre.",
    settingsSectionPreviewType: 'Typographie de l’aperçu',
    previewTypeHint: "Les trois premières polices sont celles réglées dans Obsidian même : la carte peut ainsi s'accorder à la note ou à l'interface sans rien choisir.",
    optFontInterface: "Police d'interface d'Obsidian",
    optFontText: "Police de texte d'Obsidian",
    optFontMono: "Police à chasse fixe d'Obsidian",
    optFontSystem: 'Système',
    optFontSans: 'Sans empattement',
    optFontSerif: 'Avec empattements',
    optFontSlab: 'Empattements carrés',
    optFontMonospace: 'Chasse fixe',
    settingPreviewTitleFontName: 'Police du titre',
    settingPreviewTitleSizeName: 'Taille du titre',
    settingPreviewTitleWeightName: 'Graisse du titre',
    settingPreviewTextFontName: 'Police du texte',
    settingPreviewTextSizeName: 'Taille du texte',
    settingPreviewTextWeightName: 'Graisse du texte',
    settingPreviewLineName: 'Interligne',
    settingPreviewLineDesc: 'Hauteur de ligne du texte de l’aperçu, en pourcentage de sa taille de police.',
    settingSpanName: 'Barres dans la vague',
    settingSpanDesc: (span, side) => 'Toujours impair : une barre au centre et ' + side + ' de chaque côté. Actuellement ' + span + '.',
    settingsSectionSteps: 'Longueur de chaque palier',
    stepsHint: 'Chaque curseur donne la longueur d’une barre en pixels à pleine force de vague. Le centre est la barre sous le curseur, les autres se reflètent au-dessus et au-dessous.',
    settingStepCenterName: 'Barre centrale',
    settingStepName: (d) => 'Barre à ' + d + ' de distance',
    settingSharpName: 'Centre net',
    settingSharpDesc: "La barre la plus proche du curseur atteint toujours sa pleine longueur et toutes les autres restent strictement plus courtes. Sans cela, les deux barres entre lesquelles se trouve le curseur se partagent la force, et une voisine peut devenir plus longue que celle que vous visez.",
    settingReactZoneName: 'Zone de réaction',
    settingReactZoneDesc: "À quelle distance du rail les barres commencent à répondre, en pixels. La force s'éteint doucement au bord extérieur de la zone, si bien que la vague vient à la rencontre du curseur au lieu de surgir. À zéro, les barres ne réagissent qu'une fois le curseur sur le rail lui-même.",
    settingHorizontalMinName: 'Force tout au bord',
    settingHorizontalMinDesc: "Force de la vague quand le curseur est collé au bord de la fenêtre, en pourcentage de la pleine force. Plus la valeur est basse, plus le rail paraît retenu tant que vous ne partez pas vers le texte.",
    settingCapsModeName: 'Repères des extrémités',
    settingCapsModeDesc: 'Les deux courtes barres du début et de la fin de la note.',
    optCapsOn: 'Visibles et cliquables',
    optCapsQuiet: 'Visibles, mais non cliquables',
    optCapsOff: 'Retirer complètement',
    optCurveCustom: 'Votre propre forme, en pixels',
    settingCenterModeName: 'Où la vague se centre',
    settingCenterModeDesc: "Sur une barre — l'espace vide entre les barres est coupé en deux ; tant que le curseur reste au-dessus d'une barre, rien ne bouge du tout. Passez la moitié et la vague glisse vers la suivante, aussi souplement qu'elle suivrait le curseur. Librement — le centre se tient exactement sous le curseur, les deux barres entre lesquelles il se trouve se partagent la vague et bougent toutes deux au moindre mouvement.",
    optCenterSnap: 'Sur une barre',
    optCenterFree: 'Librement, sous le curseur',
    settingRailEdgeName: 'Distance au bord de la fenêtre',
    settingRailEdgeDesc: 'De combien tout le rail est écarté du bord de la note, en pixels.',
    settingColGapName: 'Écart entre les colonnes',
    settingColGapDesc: 'Espace entre les colonnes de barres sur les notes trop longues pour une seule colonne, en pixels.',
    settingLevelThickName: (n) => 'Niveau ' + n + ' — épaisseur',
    settingLevelFadeName: (n) => 'Niveau ' + n + ' — opacité',
    settingGlowLiftName: 'La mise en évidence ramène les barres au premier plan',
    settingGlowLiftDesc: "De combien la mise en évidence tire une barre vers la pleine opacité, en pourcentage. Sans cela elle était multipliée par l'opacité générale et disparaissait presque : on avait l'impression que seule la barre courante s'allumait.",
    settingGlowColorName: 'Couleur de la mise en évidence',
    settingGlowColorDesc: 'Couleur de la mise en évidence de la position. Par défaut, celle du titre courant.',
    settingsSectionPresets: 'Styles tout prêts',
    presetsHint: "Un style est un ensemble de valeurs appliquées d'un coup. Choisissez-en un, appliquez-le et continuez à ajuster à partir de là — rien n'est verrouillé. Les styles envoyés par d'autres arrivent ici après vérification par l'auteur.",
    settingPresetName: 'Style',
    settingPresetDesc: "S'applique au profil que vous modifiez en ce moment. Tout ce que le style ne mentionne pas reste tel que vous l'aviez.",
    presetApply: 'Appliquer',
    presetApplied: (name) => 'Style appliqué : ' + name,
    settingShareName: 'Partager votre style',
    settingShareDesc: 'Si vous êtes arrivé à quelque chose qui vous plaît, vous pouvez l’envoyer. Les styles vérifiés rejoignent la liste dans une version ultérieure.',
    shareOpen: 'Partager…',
    shareTitle: 'Partager votre style',
    shareIntro: "Voici les valeurs que vous utilisez en ce moment. Copiez-les et envoyez-les par courriel. Rien ne part tout seul — le greffon ouvre seulement votre messagerie avec la lettre prête.",
    shareCopy: 'Copier les réglages',
    shareCopied: 'Réglages copiés dans le presse-papiers',
    shareCopyManual: 'Copiez le texte sélectionné à la main',
    shareMail: 'Ouvrir un courriel',
    shareSubject: 'Heading Rail — un style à examiner',
    shareBody: 'Collez les réglages copiés sous cette ligne, et ajoutez un nom pour le style si vous en avez un en tête.\n\n',
    shareNote: "Seules les valeurs des réglages du greffon sont incluses. Ni le texte des notes, ni les noms de fichiers, ni rien d'autre de votre coffre.",
    contactLine: 'Des idées pour ce greffon, ou pour un autre ? Écrivez à l’auteur :',
    settingPreviewTitleColorName: 'Couleur du titre',
    settingPreviewTextColorName: 'Couleur du texte',
    settingsSectionPanelLook: 'Couleurs du plan',
    settingPanelBgName: 'Fond du plan',
    settingPanelTextName: 'Texte du plan',
    settingPanelActiveTextName: 'Entrée courante',
    presetBase: 'Base',
    glowHint: "Deux choses distinctes, chacune activable à part : la barre courante et le halo autour d'elle. Le halo se règle comme les longueurs de barres — combien de barres il atteint et la clarté de chaque palier, identique au-dessus et au-dessous.",
    settingActiveGlowName: 'Mettre en évidence la barre courante',
    settingActiveGlowDesc: 'La barre du titre où vous vous trouvez en ce moment.',
    optGlowAlways: 'Toujours',
    optGlowHover: 'Seulement en pointant le rail',
    optGlowTouch: 'Seulement tant que le doigt est sur le rail',
    settingHaloModeName: 'Halo autour',
    settingHaloModeDesc: 'Les voisines de la barre courante, qui pâlissent en s’en éloignant.',
    settingHaloSpanName: 'Barres dans le halo',
    settingHaloSpanDesc: (span, side) => 'Toujours impair : la barre courante et ' + side + ' de chaque côté. Actuellement ' + span + '.',
    settingsSectionHaloSteps: 'Clarté de chaque palier',
    haloStepsHint: 'Clarté d’une barre à chaque distance de la courante, en pourcentage. Le palier un est sa voisine immédiate, et les mêmes valeurs valent au-dessus comme au-dessous.',
    settingHaloStepName: (d) => 'Palier ' + d,
    colourHint: 'Chaque couleur est sur la même ligne que son opacité, et la flèche de droite la rend à votre thème.',
    settingCapThickName: 'Repères — épaisseur',
    settingCapOpacityName: 'Repères — opacité',
    settingPanelGapName: 'Distance aux barres',
    settingPanelGapDesc: 'Espace entre le rail et la liste du plan, en pixels.',
    settingsSectionPreviewLook: 'Couleurs de l’aperçu',
    settingMobileOnName: 'Utiliser le greffon sur ce téléphone',
    settingMobileOnDesc: "Obsidian a son propre geste de balayage près du bord de l'écran, et il vient gêner le rail. Si le téléphone vous donne du coup plus de mal que d'aide, coupez le greffon ici — sur l'ordinateur tout continue exactement comme avant.",
    mobileOffHint: 'Le rail est coupé sur téléphone. Les autres réglages du téléphone sont masqués, puisque rien ici n’aurait d’effet.',
    settingFollowThemeName: 'Suivre le thème',
    settingFollowThemeDesc: 'Les couleurs venues d\'un style tout prêt sont ajustées pour ne jamais finir clair sur clair ni sombre sur sombre : l\'auteur du style les a choisies pour son thème, pas pour le vôtre. Les couleurs que vous posez vous-même ne sont jamais touchées — même si elles se rapprochent du fond.',
    settingRadiusName: 'Arrondi des coins',
    settingRadiusDesc: 'Une seule valeur pour tout ce que dessine le greffon : la carte d’aperçu, la liste du plan et le champ de recherche.',
    settingActiveMoveName: 'Quand la barre courante change',
    settingActiveMoveDesc: "Saut — la mise en évidence apparaît aussitôt au nouvel endroit. Trajet — elle s'y rend, en traînant derrière elle une traîne qui s'efface. C'est le saut par-dessus la moitié du rail qui paraît si brusque quand on clique dans le plan.",
    optMoveTravel: 'Se rend au nouvel endroit',
    optMoveInstant: 'Saute directement',
    settingTravelTimeName: 'Durée du trajet',
    settingTravelTimeDesc: 'Temps que met la mise en évidence pour arriver, en millisecondes.',
    settingTravelOvershootName: 'Dépassement à l’arrivée',
    settingTravelOvershootDesc: 'De combien elle dépasse la destination avant de se poser.',
    settingTravelTrailName: 'Traîne en chemin',
    settingTravelTrailDesc: 'Avec quelle clarté s’allument les barres devant lesquelles elle passe. À zéro, un simple trajet sans rien derrière.',
    shareNameName: 'Nom du style',
    shareNameDesc: 'Facultatif. Il part dans la lettre, pour que le style ait un nom.',
    shareNamePlaceholder: 'par exemple : Règle de nuit',
    shareWhichName: 'Ce qui est envoyé',
    shareWhichDesc: 'Chaque ensemble est étiqueté dans la lettre, ordinateur et téléphone ne se mélangent donc jamais.',
    shareBoth: 'Les deux — ordinateur et téléphone',
    presetStateOn: (name) => 'Actif en ce moment : ' + name + '.',
    presetStateChanged: (name) => 'Actif en ce moment : ' + name + ', avec vos modifications par-dessus.',
    presetRestore: 'Revenir au style',
    settingScrollToName: 'Où le titre se pose',
    settingScrollToDesc: 'Quand vous sautez à un titre depuis le rail ou le plan, à quel endroit de l’écran il se retrouve.',
    optScrollTop: 'En haut',
    optScrollUpper: 'Au tiers de la hauteur',
    optScrollCenter: 'Au milieu',
    contributeLine: 'Vous avez fait un fork vraiment meilleur ? Envoyez-moi le code source et expliquez comment vous l\'avez réalisé. Si c\'est réellement mieux, je l\'intègre à la prochaine version et je vous cite comme co-auteur. Je me réserve le droit de retravailler votre code, mais s\'il a servi de base, vous serez cité quoi qu\'il arrive.',
  },
  ru: {
    tocTooltip: 'Структура заметки',
    trashTooltip: 'История разделов',
    searchPlaceholder: 'Поиск по структуре',
    startOfDoc: 'Начало документа',
    endOfDoc: 'Конец документа',
    jumpAboveLabel: 'Текущее место выше — показать',
    jumpBelowLabel: 'Текущее место ниже — показать',
    delete: 'Удалить',
    deleteN: (n) => 'Удалить ' + n,
    copy: 'Копировать',
    copyN: (n) => 'Копировать ' + n,
    copyAgain: 'Скопировать снова',
    cancel: 'Отмена',
    restore: 'Восстановить',
    forget: 'Забыть',
    historyTitle: 'История разделов',
    trashCopiedHead: 'Скопировано',
    trashCopiedEmpty: 'Пока ничего не скопировано.',
    trashDeletedHead: 'Удалено',
    trashDeletedEmpty: 'Пока ничего не удалено.',
    trashHint: 'Свежие сверху. Если файл правили после удаления, сначала восстановите более поздние записи.',
    settingSearchName: 'Строка поиска',
    settingSearchDesc: 'Показывать поле поиска рядом с раскрытой структурой.',
    settingSearchBottomName: 'Поиск снизу',
    settingSearchBottomDesc: 'Поменять местами: поиск под структурой, структура сверху.',
    settingTrashMaxName: 'Хранить удалений',
    settingTrashMaxDesc: 'Сколько записей держать в списке удалённых разделов.',
    cmdDeleteSelected: 'Удалить выбранные разделы',
    cmdCopySelected: 'Скопировать выбранные разделы',
    cmdRestoreLast: 'Восстановить последнее удаление',
    noticeReadFail: 'Heading Rail: не удалось прочитать файл',
    noticeStale: 'Структура устарела — обновите список и повторите',
    noticeDeleted: (sections, lines) => 'Удалено разделов: ' + sections + ', строк: ' + lines,
    noticeNothingToRestore: 'Нечего восстанавливать',
    noticeFileNotFound: 'Файл не найден',
    noticeReadFail2: 'Не удалось прочитать файл',
    noticeChangedAfterDelete: 'Файл изменился после этого удаления. Сначала восстановите более поздние записи либо используйте Ctrl+Z.',
    noticeRestored: 'Удалённое восстановлено',
    noticeCopied: (sections, lines) => 'Скопировано разделов: ' + sections + ', строк: ' + lines,
    noticeCopyFail: 'Не удалось скопировать в буфер обмена',
    noticeRestoreFail: (msg) => 'Не удалось восстановить: ' + msg,
    settingsSectionLayout: 'Расположение',
    settingsSectionColour: 'Цвет',
    settingsSectionPreview: 'Подсказка при наведении',
    settingsSectionOutline: 'Структура',
    settingSideName: 'Сторона',
    settingSideDesc: 'У какого края заметки закреплены полоски.',
    optRight: 'Справа',
    optLeft: 'Слева',
    settingSpacingName: 'Интервал между полосками',
    settingSpacingDesc: 'Подстраивающийся распределяет полоски по доступной высоте. Постоянный держит один и тот же интервал вне зависимости от числа заголовков.',
    optAdaptive: 'Подстраивающийся',
    optFixed: 'Постоянный',
    settingFixedSpacingName: 'Постоянный интервал',
    settingFixedSpacingDesc: 'Промежуток между полосками, в пикселях.',
    settingHoverScrollName: 'Прокрутка по наведению',
    settingHoverScrollDesc: 'Двигать документ, пока курсор проходит по полоскам, без нажатия.',
    settingBarColorName: 'Цвет полосок',
    settingBarColorDesc: 'Оставьте пустым, чтобы взять цвет темы. Подходит любой CSS-цвет.',
    settingActiveColorName: 'Цвет активной полоски',
    settingActiveColorDesc: 'Цвет полоски, отмечающей текущее место. Пусто — берётся акцентный цвет темы.',
    settingGradientName: 'Переход цвета',
    settingGradientDesc: 'Перетекание полосок из одного цвета в другой вдоль рельса. Отменяет цвет полосок выше.',
    settingGradientStartName: 'Начало перехода',
    settingGradientEndName: 'Конец перехода',
    settingPreviewToggleName: 'Показывать подсказку',
    settingPreviewToggleDesc: 'Небольшая карточка с названием раздела и началом его текста, показывается при наведении.',
    optPreviewOff: 'Не показывать',
    optPreviewBars: 'На полосках',
    optPreviewOutline: 'На структуре',
    settingPreviewLenName: 'Длина подсказки',
    settingPreviewLenDesc: 'Сколько знаков текста раздела показывать.',
    errWriteConflict: 'файл изменился во время операции, попробуйте снова',
    noticeModifyFail: (msg) => 'Heading Rail: ' + (msg || 'не удалось изменить файл'),
    consoleFallbackCss: '[Heading Rail] styles.css не найден рядом с main.js — включена встроенная копия.',
    consoleStyleCheckFail: '[Heading Rail] не удалось проверить стили:',
    consoleBuildFail: '[Heading Rail] ошибка при построении интерфейса:',
    trashNoTitle: '(без названия)',
    trashMeta: (lines, path, when) => lines + ' стр. · ' + path + ' · ' + when,
    settingLanguageName: 'Язык интерфейса',
    settingLanguageDesc: 'Язык надписей самого плагина. По умолчанию берётся из настроек Obsidian.',
    optLanguageAuto: 'Как в Obsidian',
    profileDesktop: 'Компьютер',
    profileMobile: 'Телефон',
    mobileProfileHint: 'Настройки телефона хранятся отдельно. Кнопка-звено у настройки берёт значение с компьютера и дальше меняется вместе с ним.',
    linkToDesktop: 'Взять значение с компьютера',
    unlinkFromDesktop: 'Задать отдельно от компьютера',
    resetToTheme: 'Вернуть цвет темы',
    settingAnchorName: 'Где держать рельс',
    settingAnchorDesc: 'К какому месту по высоте привязаны полоски, когда их меньше, чем помещается на экран.',
    optAnchorCenter: 'По центру',
    optAnchorTop: 'Сверху',
    optAnchorBottom: 'Снизу',
    settingSpacingMinName: 'Наименьший интервал',
    settingSpacingMinDesc: 'Ближе этого полоски друг к другу не становятся.',
    settingSpacingMaxName: 'Наибольший интервал',
    settingSpacingMaxDesc: 'Дальше этого полоски не расходятся даже в короткой заметке.',
    settingThicknessName: 'Толщина полоски',
    settingThicknessDesc: 'Высота полоски в пикселях.',
    settingBarWidthName: 'Общая длина полосок',
    settingBarWidthDesc: 'Множитель длины в покое, в процентах: действует сразу на все уровни заголовков.',
    settingsSectionWave: 'Волна',
    settingsSectionWaveFine: 'Волна — тонкая настройка',
    settingsSectionBars: 'Полоски',
    settingsSectionLevels: 'Длина по уровням заголовков',
    settingsSectionGlow: 'Подсветка положения',
    waveIntro: 'Каждый кадр полоска получает одно число — насколько сильно до неё дошла волна. Дальше каждое свойство ниже идёт по этому числу от значения в покое к значению на пике. Поэтому можно получить длину без цвета, цвет без длины или и то и другое сразу.',
    levelsHint: 'Длина полоски в покое в пикселях, до общего множителя, заданного выше.',
    settingPeakModeName: 'Длина на пике',
    settingPeakModeDesc: 'Общая длина тянет все полоски к одной длине, и вершина волны получается ровной. Прибавка добавляет каждой полоске одинаковое число пикселей к её собственной длине, и полоски глубоких уровней остаются короче.',
    optPeakTarget: 'Общая длина',
    optPeakAdd: 'Прибавка к своей',
    settingPeakLengthName: 'Длина в центре волны',
    settingPeakLengthDesc: 'Какой длины становится полоска в самом центре волны, в пикселях.',
    settingPeakAddName: 'Прибавка в центре волны',
    settingPeakAddDesc: 'Сколько пикселей прибавляется полоске в самом центре волны.',
    settingCurveName: 'Форма волны',
    settingCurveDesc: 'Как сила волны спадает от её центра к краям.',
    optCurveBell: 'Колокол — мягко, без видимой границы',
    optCurvePeak: 'Пик — острый центр, длинные хвосты',
    optCurvePlateau: 'Плато — ровная вершина, крутые края',
    optCurveCosine: 'Дуга — ровная кривая с чистым краем',
    optCurveWedge: 'Клин — прямой спад',
    optCurveStep: 'Ступень — либо полностью, либо никак',
    optCurveRipple: 'Рябь — за волной идёт вторая, послабее',
    settingEdgeName: 'Резкость краёв',
    settingEdgeDesc: 'Подстройка выбранной формы: больше — уже и резче. Дуга, клин и ступень эту настройку не используют.',
    settingPeakBrightName: 'Яркость на пике',
    settingPeakBrightDesc: 'Сколько цвета волны подмешано в полоску в центре волны. Ноль оставляет цвет как есть, и меняется только длина.',
    settingRestBrightName: 'Яркость в покое',
    settingRestBrightDesc: 'Сколько цвета волны несут все полоски, пока волны на них нет.',
    settingWaveColorName: 'Цвет волны',
    settingWaveColorDesc: 'Цвет, который волна подмешивает в полоски. По умолчанию берётся цвет текста вашей темы.',
    settingRestOpacityName: 'Непрозрачность в покое',
    settingRestOpacityDesc: 'Насколько плотные полоски, пока волны на них нет.',
    settingPeakOpacityName: 'Непрозрачность на пике',
    settingPeakOpacityDesc: 'Насколько плотная полоска в центре волны.',
    settingPeakThickName: 'Толщина на пике',
    settingPeakThickDesc: 'Толщина полоски в центре волны, в процентах от её толщины в покое. Сто процентов — толщина не меняется.',
    settingFollowName: 'Время догона',
    settingFollowDesc: 'За сколько миллисекунд волна доходит до курсора. Ноль прикалывает её к курсору намертво.',
    settingOvershootName: 'Проскок',
    settingOvershootDesc: 'Насколько волна пролетает мимо курсора при резком движении, прежде чем вернуться. Ноль — приходит и останавливается.',
    settingRiseName: 'Разгон',
    settingRiseDesc: 'За сколько волна набирает полную силу, когда курсор пришёл.',
    settingFallName: 'Угасание',
    settingFallDesc: 'За сколько волна гаснет после ухода курсора. Ноль — пропадает сразу.',
    settingLevelWidthName: (n) => 'Заголовок уровня ' + n,
    settingCapWidthName: 'Торцы',
    settingCapWidthDesc: 'Длина двух коротких полосок, отмечающих начало и конец заметки.',
    optGlowOff: 'Выключена',
    settingReachName: 'Захват волны',
    settingReachDesc: 'На сколько полосок волна расходится от курсора.',
    settingHorizontalName: 'Реакция на движение вбок',
    settingHorizontalDesc: 'Полоски растут ещё и по мере того, как курсор уходит вбок от края.',
    settingHorizontalRangeName: 'Расстояние вбок',
    settingHorizontalRangeDesc: 'Насколько далеко от края должен уйти курсор, чтобы полоски достигли полной длины.',
    settingPreviewTriggerName: 'Показывать подсказку',
    settingPreviewTriggerDesc: 'С какой части виджета вызывается окошко с началом раздела.',
    optTriggerBoth: 'С полосок и структуры',
    settingPreviewPlaceName: 'Где показывать подсказку',
    settingPreviewPlaceDesc: 'Автоматически — пока структура раскрыта, окошко встаёт сбоку от неё и не закрывает список.',
    optPlaceAuto: 'Автоматически',
    optPlaceRail: 'Рядом с полосками',
    optPlaceOutline: 'Рядом со структурой',
    settingPreviewBgName: 'Фон подсказки',
    settingIntensityName: 'Выразительность волны',
    settingIntensityDesc: 'Один ползунок поверх всех остальных: тянет разом длину, яркость, прозрачность, толщину и, слабее, захват. На нуле полоски перестают реагировать совсем. Всё, что ниже, задаёт характер волны, а этот ползунок — только громкость.',
    settingRailFromName: 'Рельс начинается на',
    settingRailFromDesc: 'Верхний край рельса в процентах от высоты заметки.',
    settingRailToName: 'Рельс заканчивается на',
    settingRailToDesc: 'Нижний край рельса в процентах от высоты заметки. Вместе с настройкой выше он задаёт полосу, в которой живут полоски, а привязка по высоте решает, где внутри этой полосы они встанут, когда их слишком мало, чтобы её заполнить.',
    panelWaveHint: 'На пике полоска длиннее рельса, поэтому при раскрытой структуре она легла бы на список. Эти два выключателя говорят, стоят ли полоски в таком состоянии неподвижно; если они всё же движутся, структура отъезжает вбок ровно на то, что полоски отбирают.',
    settingWavePinnedName: 'Анимировать при закреплённой структуре',
    settingWavePinnedDesc: 'Выключено — пока структура закреплена, полоски остаются в своей длине.',
    settingWavePeekName: 'Анимировать при удержании Ctrl',
    settingWavePeekDesc: 'Выключено — пока структуру подглядывают через Ctrl, полоски стоят неподвижно.',
    linkedNote: 'Сейчас берётся значение с компьютера — нажмите кнопку со звеном, чтобы задать телефону своё.',
    settingPreviewGapName: 'Расстояние от полосок',
    settingPreviewGapDesc: 'Зазор между рельсом и окошком подсказки в пикселях. Место, которое полоски занимают на пике, добавляется сверху само, так что самая длинная полоска на окошко не ложится.',
    settingPreviewWidthName: 'Ширина окошка',
    settingPreviewWidthDesc: 'Ширина окошка подсказки в пикселях, с ограничением по ширине окна.',
    settingsSectionPreviewType: 'Шрифты подсказки',
    previewTypeHint: 'Первые три шрифта — те, что настроены в самом Obsidian, поэтому окошко может совпадать со шрифтом заметки или интерфейса без отдельного выбора.',
    optFontInterface: 'Интерфейсный шрифт Obsidian',
    optFontText: 'Текстовый шрифт Obsidian',
    optFontMono: 'Моноширинный шрифт Obsidian',
    optFontSystem: 'Системный',
    optFontSans: 'Без засечек',
    optFontSerif: 'С засечками',
    optFontSlab: 'С прямыми засечками',
    optFontMonospace: 'Моноширинный',
    settingPreviewTitleFontName: 'Шрифт заголовка',
    settingPreviewTitleSizeName: 'Размер заголовка',
    settingPreviewTitleWeightName: 'Толщина заголовка',
    settingPreviewTextFontName: 'Шрифт текста',
    settingPreviewTextSizeName: 'Размер текста',
    settingPreviewTextWeightName: 'Толщина текста',
    settingPreviewLineName: 'Межстрочный интервал',
    settingPreviewLineDesc: 'Высота строки текста подсказки в процентах от размера шрифта.',
    settingSpanName: 'Полосок в волне',
    settingSpanDesc: (span, side) => 'Всегда нечётное: одна полоска в центре и по ' + side + ' с каждой стороны. Сейчас ' + span + '.',
    settingsSectionSteps: 'Длина каждой ступени',
    stepsHint: 'Каждый ползунок — длина одной полоски в пикселях при полной силе волны. Центр — полоска под курсором, остальные зеркально сверху и снизу от неё.',
    settingStepCenterName: 'Центральная полоска',
    settingStepName: (d) => 'Полоска через ' + d,
    settingSharpName: 'Чёткий центр',
    settingSharpDesc: 'Ближайшая к курсору полоска всегда доходит до полной длины, остальные строго короче. Без этого сила делится между двумя полосками, между которыми стоит курсор, и соседняя может оказаться длиннее той, на которую наведено.',
    settingReactZoneName: 'Зона реакции',
    settingReactZoneDesc: 'На каком расстоянии от рельса полоски начинают отзываться, в пикселях. У дальней границы зоны сила плавно сходит на нет, поэтому волна подходит вместе с курсором, а не выскакивает. Ноль — полоски реагируют, только когда курсор уже над рельсом.',
    settingHorizontalMinName: 'Сила у самого края',
    settingHorizontalMinDesc: 'Насколько сильна волна, когда курсор прижат к краю окна, в процентах от полной. Чем меньше, тем сдержаннее рельс, пока не двинешься в сторону текста.',
    settingCapsModeName: 'Торцы',
    settingCapsModeDesc: 'Две короткие полоски для начала и конца заметки.',
    optCapsOn: 'Видны и нажимаются',
    optCapsQuiet: 'Видны, но не нажимаются',
    optCapsOff: 'Убрать совсем',
    optCurveCustom: 'Своя форма, в пикселях',
    settingCenterModeName: 'Где стоит центр волны',
    settingCenterModeDesc: 'На полоске — пустое место между полосками делится ровно пополам, поэтому, пока курсор над одной полоской, не движется ничего; перешли середину — волна переезжает к следующей так же плавно, как она шла бы за курсором. Свободно — центр стоит точно под курсором, и две полоски, между которыми он оказался, делят волну и обе шевелятся от каждого малого движения.',
    optCenterSnap: 'На полоске',
    optCenterFree: 'Свободно, под курсором',
    settingRailEdgeName: 'Отступ от края окна',
    settingRailEdgeDesc: 'Насколько весь рельс отодвинут от края заметки, в пикселях.',
    settingColGapName: 'Промежуток между столбцами',
    settingColGapDesc: 'Расстояние между столбцами полосок на заметках, которым одного столбца мало, в пикселях.',
    settingLevelThickName: (n) => 'Уровень ' + n + ' — толщина',
    settingLevelFadeName: (n) => 'Уровень ' + n + ' — непрозрачность',
    settingGlowLiftName: 'Подсветка выводит полоски вперёд',
    settingGlowLiftDesc: 'Насколько подсветка подтягивает полоску к полной плотности, в процентах. Без этого подсветка умножалась на общую прозрачность и почти пропадала, из-за чего казалось, что светится только текущая полоска.',
    settingGlowColorName: 'Цвет подсветки',
    settingGlowColorDesc: 'Цвет подсветки положения. По умолчанию берётся цвет текущего заголовка.',
    settingsSectionPresets: 'Готовые наборы',
    presetsHint: 'Набор — это значения, которые применяются разом. Выберите, примените и правьте дальше от него: ничего не запирается. Наборы, присланные другими людьми, попадают сюда после проверки автором.',
    settingPresetName: 'Набор',
    settingPresetDesc: 'Применяется к тому профилю, который вы сейчас правите. Всё, чего в наборе нет, остаётся как было.',
    presetApply: 'Применить',
    presetApplied: (name) => 'Набор применён: ' + name,
    settingShareName: 'Поделиться своим набором',
    settingShareDesc: 'Если получилось что-то удачное, набор можно прислать. Проверенные попадают в список в одном из следующих выпусков.',
    shareOpen: 'Поделиться…',
    shareTitle: 'Поделиться своим набором',
    shareIntro: 'Ниже — значения, которыми вы пользуетесь сейчас. Скопируйте их и отправьте письмом. Само по себе никуда ничего не уходит: плагин только открывает почту с готовым письмом.',
    shareCopy: 'Скопировать настройки',
    shareCopied: 'Настройки скопированы в буфер обмена',
    shareCopyManual: 'Скопируйте выделенный текст вручную',
    shareMail: 'Открыть письмо',
    shareSubject: 'Heading Rail — набор на рассмотрение',
    shareBody: 'Вставьте скопированные настройки ниже этой строки и, если есть, напишите название набора.\n\n',
    shareNote: 'В набор попадают только значения настроек плагина. Ни текст заметок, ни имена файлов, ни что-либо ещё из хранилища сюда не входит.',
    contactLine: 'Есть идеи по этому плагину или по другим? Напишите автору:',
    settingPreviewTitleColorName: 'Цвет заголовка',
    settingPreviewTextColorName: 'Цвет текста',
    settingsSectionPanelLook: 'Цвета структуры',
    settingPanelBgName: 'Фон структуры',
    settingPanelTextName: 'Текст структуры',
    settingPanelActiveTextName: 'Текущий пункт',
    presetBase: 'Base',
    glowHint: 'Две разные вещи, и каждая включается сама по себе: текущая полоска и ореол вокруг неё. Ореол настраивается так же, как длины полосок — сколько полосок он захватывает и какая яркость у каждой ступени, одинаково вверх и вниз.',
    settingActiveGlowName: 'Подсвечивать текущую полоску',
    settingActiveGlowDesc: 'Полоска того заголовка, в котором вы сейчас находитесь.',
    optGlowAlways: 'Всегда',
    optGlowHover: 'Только при наведении на рельс',
    optGlowTouch: 'Только пока палец на рельсе',
    settingHaloModeName: 'Ореол вокруг неё',
    settingHaloModeDesc: 'Соседние полоски, тускнеющие по мере удаления от текущей.',
    settingHaloSpanName: 'Полосок в ореоле',
    settingHaloSpanDesc: (span, side) => 'Всегда нечётное: текущая полоска и по ' + side + ' с каждой стороны. Сейчас ' + span + '.',
    settingsSectionHaloSteps: 'Яркость каждой ступени',
    haloStepsHint: 'Насколько ярка полоска на каждом расстоянии от текущей, в процентах. Первая ступень — ближайшая соседка, и те же значения берутся вверх и вниз.',
    settingHaloStepName: (d) => 'Ступень ' + d,
    colourHint: 'Каждый цвет стоит в одной строке со своей прозрачностью, а стрелка справа возвращает его вашей теме.',
    settingCapThickName: 'Торцы — толщина',
    settingCapOpacityName: 'Торцы — непрозрачность',
    settingPanelGapName: 'Расстояние от полосок',
    settingPanelGapDesc: 'Зазор между рельсом и списком структуры, в пикселях.',
    settingsSectionPreviewLook: 'Цвета подсказки',
    settingMobileOnName: 'Пользоваться плагином на этом телефоне',
    settingMobileOnDesc: 'У Obsidian есть свой жест у края экрана, и он умеет мешать рельсу. Если из-за этого на телефоне выходит больше мороки, чем пользы, выключите плагин здесь — на компьютере всё продолжит работать как работало.',
    mobileOffHint: 'Рельс на телефонах выключен. Остальные настройки телефона скрыты: им здесь всё равно нечего делать.',
    settingFollowThemeName: 'Подстраиваться под тему',
    settingFollowThemeDesc: 'Цвета, пришедшие из готового набора, подстраиваются так, чтобы не оказаться светлым по светлому или тёмным по тёмному: автор набора подбирал их под свою тему, а не под вашу. Цвета, выставленные вами, не трогаются никогда — даже если получились почти как фон.',
    settingRadiusName: 'Скругление углов',
    settingRadiusDesc: 'Одно значение на всё, что рисует плагин: окошко подсказки, список структуры и поле поиска.',
    settingActiveMoveName: 'Когда меняется текущая полоска',
    settingActiveMoveDesc: 'Перескок — выделение сразу появляется на новом месте. Переезд — оно туда едет, оставляя за собой затухающий след. Именно перескок через полрельса и выглядит резко, когда щёлкаешь по структуре.',
    optMoveTravel: 'Переезжает на новое место',
    optMoveInstant: 'Перескакивает сразу',
    settingTravelTimeName: 'Время переезда',
    settingTravelTimeDesc: 'За сколько миллисекунд выделение доезжает до места.',
    settingTravelOvershootName: 'Проскок при приезде',
    settingTravelOvershootDesc: 'Насколько выделение пролетает мимо места, прежде чем встать.',
    settingTravelTrailName: 'След по пути',
    settingTravelTrailDesc: 'Насколько ярко вспыхивают полоски, мимо которых оно проходит. Ноль — просто переезд, без следа.',
    shareNameName: 'Название набора',
    shareNameDesc: 'Необязательно. Попадёт в письмо, чтобы набор было как называть.',
    shareNamePlaceholder: 'например: Ночная линейка',
    shareWhichName: 'Что отправлять',
    shareWhichDesc: 'В письме каждый набор подписан, так что компьютер и телефон не перепутаются.',
    shareBoth: 'Оба — компьютер и телефон',
    presetStateOn: (name) => 'Сейчас включён: ' + name + '.',
    presetStateChanged: (name) => 'Сейчас включён: ' + name + ', поверх него ваши изменения.',
    presetRestore: 'Вернуть набор',
    settingScrollToName: 'Куда встаёт заголовок',
    settingScrollToDesc: 'При переходе к заголовку с рельса или из структуры — в каком месте экрана он окажется.',
    optScrollTop: 'Вверху',
    optScrollUpper: 'На трети высоты',
    optScrollCenter: 'По центру',
    contributeLine: 'Сделали форк, который реально лучше? Пришлите исходник и расскажите, как вы это реализовали. Если это правда лучше — обновлю версию и отмечу вас соавтором. Код могу переделать по-своему, но если он лёг в основу, отмечу вас всё равно.',
  },

  ja: {
    tocTooltip: 'ノート構造',
    trashTooltip: 'セクション履歴',
    searchPlaceholder: '構造内を検索',
    startOfDoc: 'ドキュメントの先頭',
    endOfDoc: 'ドキュメントの末尾',
    jumpAboveLabel: '現在位置は上にあります — 表示する',
    jumpBelowLabel: '現在位置は下にあります — 表示する',
    delete: '削除',
    deleteN: (n) => '削除 (' + n + ')',
    copy: 'コピー',
    copyN: (n) => 'コピー (' + n + ')',
    copyAgain: 'もう一度コピー',
    cancel: 'キャンセル',
    restore: '復元',
    forget: '破棄',
    historyTitle: 'セクション履歴',
    trashCopiedHead: 'コピー済み',
    trashCopiedEmpty: 'まだコピーされたものはありません。',
    trashDeletedHead: '削除済み',
    trashDeletedEmpty: 'まだ削除されたものはありません。',
    trashHint: '新しい順に表示されます。削除後にファイルを編集した場合は、先に新しい項目を復元してください。',
    settingSearchName: '検索フィールド',
    settingSearchDesc: '展開された構造の横に検索ボックスを表示します。',
    settingSearchBottomName: '検索を下に配置',
    settingSearchBottomDesc: '位置を入れ替える: 検索を構造の下に、構造を上に配置します。',
    settingTrashMaxName: '保持する削除件数',
    settingTrashMaxDesc: '削除済みセクションの一覧に保持する件数。',
    cmdDeleteSelected: '選択したセクションを削除',
    cmdCopySelected: '選択したセクションをコピー',
    cmdRestoreLast: '直前の削除を復元',
    noticeReadFail: 'Heading Rail: ファイルを読み込めませんでした',
    noticeStale: '構造が古くなっています — リストを更新してもう一度お試しください',
    noticeDeleted: (sections, lines) => '削除したセクション数: ' + sections + '、行数: ' + lines,
    noticeNothingToRestore: '復元するものがありません',
    noticeFileNotFound: 'ファイルが見つかりません',
    noticeReadFail2: 'ファイルを読み込めませんでした',
    noticeChangedAfterDelete: 'この削除の後にファイルが変更されました。先に新しい項目を復元するか、Ctrl+Z を使用してください。',
    noticeRestored: '削除を復元しました',
    noticeCopied: (sections, lines) => 'コピーしたセクション数: ' + sections + '、行数: ' + lines,
    noticeCopyFail: 'クリップボードにコピーできませんでした',
    noticeRestoreFail: (msg) => '復元できませんでした: ' + msg,
    settingsSectionLayout: 'レイアウト',
    settingsSectionColour: '色',
    settingsSectionPreview: 'ホバー時のプレビュー',
    settingsSectionOutline: 'アウトライン',
    settingSideName: '配置する側',
    settingSideDesc: 'バーをノートのどちら側に固定するか。',
    optRight: '右',
    optLeft: '左',
    settingSpacingName: 'バー間の間隔',
    settingSpacingDesc: '「可変」は利用可能な高さに合わせてバーを分散させます。「固定」は見出しの数にかかわらず同じ間隔を保ちます。',
    optAdaptive: '可変',
    optFixed: '固定',
    settingFixedSpacingName: '固定間隔',
    settingFixedSpacingDesc: 'バー間の間隔（ピクセル単位）。',
    settingHoverScrollName: 'ホバーでスクロール',
    settingHoverScrollDesc: 'クリックせずに、カーソルがバーの上を通過するだけでドキュメントを動かします。',
    settingBarColorName: 'バーの色',
    settingBarColorDesc: '空欄にするとテーマの色に従います。任意の CSS カラーを指定できます。',
    settingActiveColorName: 'アクティブなバーの色',
    settingActiveColorDesc: '現在位置を示すバーの色。空欄にするとテーマのアクセントカラーに従います。',
    settingGradientName: 'グラデーション',
    settingGradientDesc: 'レール沿いにバーの色を別の色へと変化させます。上のバーの色より優先されます。',
    settingGradientStartName: 'グラデーションの開始色',
    settingGradientEndName: 'グラデーションの終了色',
    settingPreviewToggleName: 'プレビューを表示',
    settingPreviewToggleDesc: 'ホバー時に、見出しとその本文の冒頭を示す小さなカードを表示します。',
    optPreviewOff: '表示しない',
    optPreviewBars: 'バー上に表示',
    optPreviewOutline: 'アウトライン上に表示',
    settingPreviewLenName: 'プレビューの長さ',
    settingPreviewLenDesc: 'セクションの本文を何文字まで表示するか。',
    errWriteConflict: '操作中にファイルが変更されました。もう一度お試しください',
    noticeModifyFail: (msg) => 'Heading Rail: ' + (msg || 'ファイルを変更できませんでした'),
    consoleFallbackCss: '[Heading Rail] main.js の隣に styles.css が見つかりません — 内蔵コピーを使用します。',
    consoleStyleCheckFail: '[Heading Rail] スタイルを確認できませんでした:',
    consoleBuildFail: '[Heading Rail] インターフェースの構築中にエラーが発生しました:',
    trashNoTitle: '（無題）',
    trashMeta: (lines, path, when) => lines + ' 行 · ' + path + ' · ' + when,
    settingLanguageName: '表示言語',
    settingLanguageDesc: 'このプラグインの表示に使う言語です。自動を選ぶと Obsidian 本体の設定に従います。',
    optLanguageAuto: '自動',
    profileDesktop: 'パソコン',
    profileMobile: 'スマートフォン',
    mobileProfileHint: 'ここの設定はスマートフォンとタブレットにだけ効きます。設定の横の鎖ボタンを押すと、その項目だけパソコンの値を使うようになります。',
    linkToDesktop: 'パソコンの値を使う',
    unlinkFromDesktop: 'スマートフォン専用の値にする',
    resetToTheme: 'テーマの色に戻す',
    settingAnchorName: '縦方向の寄せ',
    settingAnchorDesc: 'ノートの高さのどこにバーを置くかです。',
    optAnchorCenter: '中央',
    optAnchorTop: '上',
    optAnchorBottom: '下',
    settingSpacingMinName: '最小の間隔',
    settingSpacingMinDesc: 'バー同士がこれより近づくことはありません。',
    settingSpacingMaxName: '最大の間隔',
    settingSpacingMaxDesc: '短いノートでも、バー同士がこれより離れることはありません。',
    settingThicknessName: 'バーの太さ',
    settingThicknessDesc: '各バーの太さ（ピクセル）です。',
    settingBarWidthName: 'バーの長さ',
    settingBarWidthDesc: '静止時のバーの長さを、見出しレベルごとの既定値に対する割合で指定します。',
    settingsSectionWave: '波',
    settingsSectionWaveFine: '波 — 細かい調整',
    settingsSectionBars: 'バー',
    settingsSectionLevels: '見出しレベルごとの長さ',
    settingsSectionGlow: '現在位置の強調',
    waveIntro: '各フレームで、バーごとに「波がどれだけ届いているか」という数値がひとつ決まります。下の各項目は、その数値に沿って静止時の値から頂点の値へと変化します。ですから、色を変えずに長さだけ、長さを変えずに色だけ、あるいは両方同時にといった設定ができます。',
    levelsHint: '静止時のバーの長さ（ピクセル）です。上の全体倍率をかける前の値になります。',
    settingPeakModeName: '頂点での長さ',
    settingPeakModeDesc: '共通の長さは、すべてのバーを同じ長さに引き寄せます。波の頂がそろってなだらかになります。上乗せは、各バーの元の長さに同じ分だけ足します。深い見出しほど短いままになります。',
    optPeakTarget: '共通の長さ',
    optPeakAdd: '元の長さに上乗せ',
    settingPeakLengthName: '中心での長さ',
    settingPeakLengthDesc: '波のちょうど中心で、バーがどこまで伸びるか（ピクセル）です。',
    settingPeakAddName: '中心での増分',
    settingPeakAddDesc: '波のちょうど中心で、バーに何ピクセル足すかです。',
    settingCurveName: '波の形',
    settingCurveDesc: '波の中心から端に向かって、強さがどう落ちていくかです。',
    optCurveBell: 'ベル — やわらかく、境目が見えない',
    optCurvePeak: 'ピーク — 中心が鋭く、裾が長い',
    optCurvePlateau: 'プラトー — 頂が平らで、両側が急',
    optCurveCosine: 'アーチ — なめらかで、端がはっきり',
    optCurveWedge: 'くさび — まっすぐに落ちる',
    optCurveStep: '段 — 効くか効かないかの二択',
    optCurveRipple: 'さざなみ — うしろに弱い二番目の波',
    settingEdgeName: '端の鋭さ',
    settingEdgeDesc: '選んだ形の微調整です。値を大きくすると幅が狭まり、端が硬くなります。アーチ・くさび・段はこの値を見ません。',
    settingPeakBrightName: '頂点での明るさ',
    settingPeakBrightDesc: '波の中心にあるバーに、波の色をどれだけ混ぜるかです。ゼロなら色はそのままで、長さだけが変わります。',
    settingRestBrightName: '静止時の明るさ',
    settingRestBrightDesc: '波が来ていないあいだ、すべてのバーが帯びている波の色の量です。',
    settingWaveColorName: '波の色',
    settingWaveColorDesc: '波がバーに混ぜる色です。既定ではテーマの文字色を使います。',
    settingRestOpacityName: '静止時の不透明度',
    settingRestOpacityDesc: '波が来ていないあいだの、バーの濃さです。',
    settingPeakOpacityName: '頂点での不透明度',
    settingPeakOpacityDesc: '波の中心にあるバーの濃さです。',
    settingPeakThickName: '頂点での太さ',
    settingPeakThickDesc: '波の中心にあるバーの太さを、静止時の太さに対する割合で指定します。100 のままなら太さは変わりません。',
    settingFollowName: '追いつく時間',
    settingFollowDesc: '波がカーソルに追いつくまでの時間（ミリ秒）です。ゼロならカーソルにぴたりと張り付きます。',
    settingOvershootName: '行き過ぎ',
    settingOvershootDesc: '速く動かしたとき、波がカーソルをどれだけ通り過ぎてから戻るかです。ゼロなら到着してそのまま止まります。',
    settingRiseName: '立ち上がり',
    settingRiseDesc: 'カーソルが来たとき、波が全力に達するまでの時間です。',
    settingFallName: '消え方',
    settingFallDesc: 'カーソルが離れたあと、波が消えるまでの時間です。ゼロなら即座に戻ります。',
    settingLevelWidthName: (n) => '見出しレベル ' + n,
    settingCapWidthName: '端の目印',
    settingCapWidthDesc: 'ノートの先頭と末尾を示す、二本の短いバーの長さです。',
    optGlowOff: 'なし',
    settingReachName: '波の広がり',
    settingReachDesc: 'カーソルから波が何本ぶんのバーまで広がるかです。',
    settingHorizontalName: '横方向の動きに反応する',
    settingHorizontalDesc: 'カーソルが端から横に離れるほど、バーがさらに伸びます。',
    settingHorizontalRangeName: '横方向の距離',
    settingHorizontalRangeDesc: 'バーが最大の長さになるまでに、カーソルが端からどれだけ離れる必要があるかです。',
    settingPreviewTriggerName: 'プレビューを出す場所',
    settingPreviewTriggerDesc: 'どの部分に触れるとプレビューのカードが出るかです。',
    optTriggerBoth: 'バーと一覧の両方',
    settingPreviewPlaceName: 'プレビューの位置',
    settingPreviewPlaceDesc: '自動にすると、一覧が開いているあいだはカードが一覧の横に回り、リストを隠しません。',
    optPlaceAuto: '自動',
    optPlaceRail: 'バーの横',
    optPlaceOutline: '一覧の横',
    settingPreviewBgName: 'プレビューの背景',
    settingIntensityName: '波の強さ',
    settingIntensityDesc: 'ほかのすべての上に立つつまみです。長さ、明るさ、不透明度、太さ、そして控えめに広がりまでを一度に引き上げます。ゼロにするとバーはまったく反応しなくなります。以下の項目が波の性格を決めるのに対し、これは音量だけを決めます。',
    settingRailFromName: 'レールの上端',
    settingRailFromDesc: 'レールの上端を、ノートの高さに対する割合で指定します。',
    settingRailToName: 'レールの下端',
    settingRailToDesc: 'レールの下端を、ノートの高さに対する割合で指定します。上の項目と合わせて、バーが収まる帯が決まります。バーが少なくて帯を埋めきれないとき、その中のどこに寄せるかは縦方向の寄せが決めます。',
    panelWaveHint: '頂点ではバーがレールより長くなるため、一覧を開いていると上に重なってしまいます。この二つのスイッチは、その状態でバーを止めておくかどうかを決めます。動かす場合は、バーが占める分だけ一覧が横にずれます。',
    settingWavePinnedName: '一覧を固定しているあいだも動かす',
    settingWavePinnedDesc: 'オフにすると、一覧を固定しているあいだバーは静止時の長さのままになります。',
    settingWavePeekName: 'Ctrl を押しているあいだも動かす',
    settingWavePeekDesc: 'オフにすると、Ctrl で一覧をのぞいているあいだバーは止まったままになります。',
    linkedNote: 'いまはパソコンの値を使っています。鎖ボタンを押すと、スマートフォン専用の値になります。',
    settingPreviewGapName: 'バーからの距離',
    settingPreviewGapDesc: 'レールとプレビューのカードのあいだの間隔（ピクセル）です。頂点のバーが取る幅は自動で上乗せされるので、いちばん長いバーがカードに重なることはありません。',
    settingPreviewWidthName: 'カードの幅',
    settingPreviewWidthDesc: 'プレビューのカードの幅（ピクセル）です。ウィンドウの幅を超えることはありません。',
    settingsSectionPreviewType: 'プレビューの文字',
    previewTypeHint: '上から三つは Obsidian 本体で設定しているフォントです。何も選ばなくても、カードをノートや画面の字面に合わせられます。',
    optFontInterface: 'Obsidian の画面用フォント',
    optFontText: 'Obsidian の本文用フォント',
    optFontMono: 'Obsidian の等幅フォント',
    optFontSystem: 'システム',
    optFontSans: 'サンセリフ',
    optFontSerif: 'セリフ',
    optFontSlab: 'スラブセリフ',
    optFontMonospace: '等幅',
    settingPreviewTitleFontName: '見出しのフォント',
    settingPreviewTitleSizeName: '見出しの大きさ',
    settingPreviewTitleWeightName: '見出しの太さ',
    settingPreviewTextFontName: '本文のフォント',
    settingPreviewTextSizeName: '本文の大きさ',
    settingPreviewTextWeightName: '本文の太さ',
    settingPreviewLineName: '行間',
    settingPreviewLineDesc: 'プレビュー本文の行の高さを、文字の大きさに対する割合で指定します。',
    settingSpanName: '波に入るバーの数',
    settingSpanDesc: (span, side) => '必ず奇数になります。中心に一本、左右に ' + side + ' 本ずつです。いまは ' + span + ' 本。',
    settingsSectionSteps: '各段の長さ',
    stepsHint: '各つまみは、波が最大のときのバー一本の長さ（ピクセル）です。中心はカーソルの下のバーで、残りはその上下に対称に並びます。',
    settingStepCenterName: '中心のバー',
    settingStepName: (d) => '中心から ' + d + ' 本目',
    settingSharpName: 'はっきりした中心',
    settingSharpDesc: 'カーソルにいちばん近いバーが必ず最大の長さになり、ほかはそれより必ず短くなります。オフにすると、カーソルが挟まれた二本のバーが強さを分け合い、隣のバーのほうが長くなることがあります。',
    settingReactZoneName: '反応する範囲',
    settingReactZoneDesc: 'レールからどれだけ離れた位置でバーが反応し始めるか（ピクセル）です。範囲の外側では強さがなめらかにゼロへ近づくので、波は突然現れるのではなくカーソルを迎えに来ます。ゼロなら、カーソルがレールの上に乗ってから反応します。',
    settingHorizontalMinName: '画面の端での強さ',
    settingHorizontalMinDesc: 'カーソルがウィンドウの端に押し付けられているときの波の強さを、最大に対する割合で指定します。小さくするほど、本文のほうへ動かすまでレールは控えめに見えます。',
    settingCapsModeName: '端の目印',
    settingCapsModeDesc: 'ノートの先頭と末尾を示す、二本の短いバーです。',
    optCapsOn: '表示し、押せる',
    optCapsQuiet: '表示するが、押せない',
    optCapsOff: '完全になくす',
    optCurveCustom: '自分で描く形（ピクセル指定）',
    settingCenterModeName: '波の中心の置き方',
    settingCenterModeDesc: 'バーに合わせる — バーとバーのあいだをちょうど半分で分けます。カーソルが一本のバーの上にあるあいだは何も動きません。半分を越えると、カーソルを追うときと同じなめらかさで次のバーへ移ります。自由 — 中心はカーソルの真下に置かれるので、挟まれた二本のバーが波を分け合い、わずかな動きでも両方が揺れます。',
    optCenterSnap: 'バーに合わせる',
    optCenterFree: '自由に、カーソルの真下',
    settingRailEdgeName: 'ウィンドウの端からの距離',
    settingRailEdgeDesc: 'レール全体をノートの端からどれだけ離すか（ピクセル）です。',
    settingColGapName: '列と列の間隔',
    settingColGapDesc: '一列では収まらない長いノートで、バーの列同士をどれだけ離すか（ピクセル）です。',
    settingLevelThickName: (n) => 'レベル ' + n + ' — 太さ',
    settingLevelFadeName: (n) => 'レベル ' + n + ' — 不透明度',
    settingGlowLiftName: '強調でバーを前に出す',
    settingGlowLiftDesc: '強調がバーをどれだけ不透明へ引き上げるかを割合で指定します。これがないと強調が全体の不透明度に掛け算されてほとんど消えてしまい、現在のバーだけが光っているように見えていました。',
    settingGlowColorName: '強調の色',
    settingGlowColorDesc: '現在位置の強調の色です。既定では現在の見出しの色を使います。',
    settingsSectionPresets: '既成のスタイル',
    presetsHint: 'スタイルとは、まとめて適用される値の組です。選んで適用し、そこから好きに調整していけます。固定されるものは何もありません。ほかの人から届いたスタイルは、作者が確認したうえでここに加わります。',
    settingPresetName: 'スタイル',
    settingPresetDesc: 'いま編集している側のプロファイルに適用されます。スタイルに含まれていない項目は、そのまま残ります。',
    presetApply: '適用',
    presetApplied: (name) => 'スタイルを適用しました：' + name,
    settingShareName: '自分のスタイルを送る',
    settingShareDesc: '気に入る設定にたどり着いたら、送ってもらえます。確認のとれたスタイルは、のちの版で一覧に加わります。',
    shareOpen: '送る…',
    shareTitle: '自分のスタイルを送る',
    shareIntro: '下にあるのが、いま使っている値の組です。これをコピーしてメールで送ってください。勝手にどこかへ送られることはありません。プラグインがするのは、下書きを入れたメールソフトを開くことだけです。',
    shareCopy: '設定をコピー',
    shareCopied: '設定をクリップボードにコピーしました',
    shareCopyManual: '選択された文字を手でコピーしてください',
    shareMail: 'メールを開く',
    shareSubject: 'Heading Rail — 検討してほしいスタイル',
    shareBody: 'コピーした設定をこの行の下に貼り付けてください。スタイルの名前が決まっていれば、それも書き添えてください。\n\n',
    shareNote: '送られるのはプラグインの設定値だけです。ノートの本文もファイル名も、保管庫の中のものは何も含まれません。',
    contactLine: 'このプラグインや別のプラグインについて案があれば、作者まで：',
    settingPreviewTitleColorName: '見出しの色',
    settingPreviewTextColorName: '本文の色',
    settingsSectionPanelLook: '一覧の色',
    settingPanelBgName: '一覧の背景',
    settingPanelTextName: '一覧の文字',
    settingPanelActiveTextName: '現在の項目',
    presetBase: 'Base',
    glowHint: '別々の二つで、それぞれ単独に入れ切りできます。ひとつは現在のバー、もうひとつはその周りの暈（かさ）です。暈の決め方はバーの長さと同じで、何本まで届くか、各段がどれだけ明るいかを上下同じに指定します。',
    settingActiveGlowName: '現在のバーを強調する',
    settingActiveGlowDesc: 'いま自分がいる見出しのバーです。',
    optGlowAlways: '常に',
    optGlowHover: 'レールを指しているあいだだけ',
    optGlowTouch: 'レールに指が触れているあいだだけ',
    settingHaloModeName: '周りの暈',
    settingHaloModeDesc: '現在のバーの隣のバーが、離れるほど淡くなっていきます。',
    settingHaloSpanName: '暈に入るバーの数',
    settingHaloSpanDesc: (span, side) => '必ず奇数になります。現在のバーと、左右に ' + side + ' 本ずつです。いまは ' + span + ' 本。',
    settingsSectionHaloSteps: '各段の明るさ',
    haloStepsHint: '現在のバーからの距離ごとに、どれだけ明るくするかを割合で指定します。一段目はすぐ隣のバーで、同じ値が上下に使われます。',
    settingHaloStepName: (d) => ' ' + d + ' 段目',
    colourHint: '色はそれぞれの不透明度と同じ行に並んでいます。右の矢印を押すと、その色をテーマに返します。',
    settingCapThickName: '端の目印 — 太さ',
    settingCapOpacityName: '端の目印 — 不透明度',
    settingPanelGapName: 'バーからの距離',
    settingPanelGapDesc: 'レールと一覧のリストのあいだの間隔（ピクセル）です。',
    settingsSectionPreviewLook: 'プレビューの色',
    settingMobileOnName: 'このスマートフォンでこのプラグインを使う',
    settingMobileOnDesc: 'Obsidian には画面の端から始まる独自のスワイプ操作があり、それがレールの邪魔をすることがあります。そのせいでスマートフォンでは手間のほうが大きいと感じるなら、ここで切ってください。パソコン側はこれまでどおり動きます。',
    mobileOffHint: 'スマートフォンではレールを切っています。ここから先の設定は、効くものが何もないため隠してあります。',
    settingFollowThemeName: 'テーマに合わせる',
    settingFollowThemeDesc: '既成のスタイルから来た色は、明るい背景に明るい色、暗い背景に暗い色とならないよう調整されます。スタイルの作者は自分のテーマに合わせて選んでおり、あなたのテーマを知らないからです。ご自身で決めた色には一切手を加えません。背景に近い色になっていてもそのままです。',
    settingRadiusName: '角の丸み',
    settingRadiusDesc: 'プラグインが描くものすべてに効く一つの値です。プレビューのカード、一覧のリスト、検索欄が対象です。',
    settingActiveMoveName: '現在のバーが変わったとき',
    settingActiveMoveDesc: '飛ぶ — 強調が新しい場所にいきなり現れます。移動する — そこまで動いていき、うしろに薄れる尾を残します。一覧を押して移動したときに強調が唐突に感じられるのは、レールの半分を一足飛びに越えるからです。',
    optMoveTravel: '新しい場所まで移動する',
    optMoveInstant: 'そのまま飛ぶ',
    settingTravelTimeName: '移動にかける時間',
    settingTravelTimeDesc: '強調が目的の場所に着くまでの時間（ミリ秒）です。',
    settingTravelOvershootName: '到着時の行き過ぎ',
    settingTravelOvershootDesc: '目的の場所をどれだけ通り過ぎてから落ち着くかです。',
    settingTravelTrailName: '途中に残る尾',
    settingTravelTrailDesc: '通り過ぎるバーがどれだけ明るく光るかです。ゼロなら、尾を残さずただ移動します。',
    shareNameName: 'スタイルの名前',
    shareNameDesc: '任意です。メールに入るので、スタイルに呼び名がつきます。',
    shareNamePlaceholder: '例：Night Ruler',
    shareWhichName: '送る内容',
    shareWhichDesc: 'それぞれの組にはメールの中で見出しが付くので、パソコンとスマートフォンが混ざることはありません。',
    shareBoth: '両方 — パソコンとスマートフォン',
    presetStateOn: (name) => 'いま使用中：' + name + '。',
    presetStateChanged: (name) => 'いま使用中：' + name + '（その上にご自身の変更があります）。',
    presetRestore: 'スタイルに戻す',
    settingScrollToName: '見出しが止まる位置',
    settingScrollToDesc: 'レールや一覧から見出しへ飛んだとき、画面のどこにその見出しが来るかです。',
    optScrollTop: '画面の上',
    optScrollUpper: '高さの三分の一あたり',
    optScrollCenter: '画面の中ほど',
    contributeLine: 'もっと良いフォークを作ったなら、ソースとその作り方を送ってください。本当に良ければ次の版に取り入れ、共同作者としてお名前を載せます。コードはこちらで手を入れることがありますが、土台にした場合はいずれにせよお名前を載せます。',
  },
  ko: {
    tocTooltip: '노트 구조',
    trashTooltip: '섹션 기록',
    searchPlaceholder: '구조 내 검색',
    startOfDoc: '문서 시작',
    endOfDoc: '문서 끝',
    jumpAboveLabel: '현재 위치가 위에 있습니다 — 표시',
    jumpBelowLabel: '현재 위치가 아래에 있습니다 — 표시',
    delete: '삭제',
    deleteN: (n) => '삭제 (' + n + ')',
    copy: '복사',
    copyN: (n) => '복사 (' + n + ')',
    copyAgain: '다시 복사',
    cancel: '취소',
    restore: '복원',
    forget: '지우기',
    historyTitle: '섹션 기록',
    trashCopiedHead: '복사됨',
    trashCopiedEmpty: '아직 복사된 항목이 없습니다.',
    trashDeletedHead: '삭제됨',
    trashDeletedEmpty: '아직 삭제된 항목이 없습니다.',
    trashHint: '최신순으로 표시됩니다. 삭제 후 파일을 편집했다면 더 최근 항목부터 복원하세요.',
    settingSearchName: '검색창',
    settingSearchDesc: '펼쳐진 구조 옆에 검색창을 표시합니다.',
    settingSearchBottomName: '검색창을 아래로',
    settingSearchBottomDesc: '위치 바꾸기: 검색창은 구조 아래, 구조는 위로.',
    settingTrashMaxName: '삭제 기록 보관 개수',
    settingTrashMaxDesc: '삭제된 섹션 목록에 보관할 항목 수.',
    cmdDeleteSelected: '선택한 섹션 삭제',
    cmdCopySelected: '선택한 섹션 복사',
    cmdRestoreLast: '마지막 삭제 복원',
    noticeReadFail: 'Heading Rail: 파일을 읽을 수 없습니다',
    noticeStale: '구조가 오래되었습니다 — 목록을 새로고침한 후 다시 시도하세요',
    noticeDeleted: (sections, lines) => '삭제된 섹션: ' + sections + '개, 줄 수: ' + lines,
    noticeNothingToRestore: '복원할 항목이 없습니다',
    noticeFileNotFound: '파일을 찾을 수 없습니다',
    noticeReadFail2: '파일을 읽을 수 없습니다',
    noticeChangedAfterDelete: '이 삭제 이후 파일이 변경되었습니다. 더 최근 항목을 먼저 복원하거나 Ctrl+Z를 사용하세요.',
    noticeRestored: '삭제가 복원되었습니다',
    noticeCopied: (sections, lines) => '복사된 섹션: ' + sections + '개, 줄 수: ' + lines,
    noticeCopyFail: '클립보드에 복사하지 못했습니다',
    noticeRestoreFail: (msg) => '복원하지 못했습니다: ' + msg,
    settingsSectionLayout: '레이아웃',
    settingsSectionColour: '색상',
    settingsSectionPreview: '호버 시 미리보기',
    settingsSectionOutline: '개요',
    settingSideName: '위치',
    settingSideDesc: '막대를 노트의 어느 쪽 가장자리에 고정할지 설정합니다.',
    optRight: '오른쪽',
    optLeft: '왼쪽',
    settingSpacingName: '막대 간 간격',
    settingSpacingDesc: '적응형은 사용 가능한 높이에 맞춰 막대를 분산시킵니다. 고정형은 제목 수와 관계없이 항상 같은 간격을 유지합니다.',
    optAdaptive: '적응형',
    optFixed: '고정형',
    settingFixedSpacingName: '고정 간격',
    settingFixedSpacingDesc: '막대 사이의 간격(픽셀 단위).',
    settingHoverScrollName: '호버 시 스크롤',
    settingHoverScrollDesc: '클릭하지 않고 커서가 막대 위를 지나가는 것만으로 문서를 스크롤합니다.',
    settingBarColorName: '막대 색상',
    settingBarColorDesc: '비워두면 테마 색상을 따릅니다. 모든 CSS 색상 값을 사용할 수 있습니다.',
    settingActiveColorName: '활성 막대 색상',
    settingActiveColorDesc: '현재 위치를 표시하는 막대의 색상. 비워두면 테마의 강조 색상을 따릅니다.',
    settingGradientName: '그라데이션',
    settingGradientDesc: '레일을 따라 막대 색상이 한 색에서 다른 색으로 서서히 바뀌게 합니다. 위의 막대 색상 설정보다 우선 적용됩니다.',
    settingGradientStartName: '그라데이션 시작 색상',
    settingGradientEndName: '그라데이션 끝 색상',
    settingPreviewToggleName: '미리보기 표시',
    settingPreviewToggleDesc: '호버 시 제목과 본문 앞부분을 보여주는 작은 카드를 표시합니다.',
    optPreviewOff: '표시하지 않음',
    optPreviewBars: '막대 위에 표시',
    optPreviewOutline: '개요 위에 표시',
    settingPreviewLenName: '미리보기 길이',
    settingPreviewLenDesc: '섹션 본문을 몇 글자까지 표시할지 설정합니다.',
    errWriteConflict: '작업 중 파일이 변경되었습니다. 다시 시도해 주세요',
    noticeModifyFail: (msg) => 'Heading Rail: ' + (msg || '파일을 수정하지 못했습니다'),
    consoleFallbackCss: '[Heading Rail] main.js 옆에서 styles.css를 찾을 수 없습니다 — 내장된 사본을 사용합니다.',
    consoleStyleCheckFail: '[Heading Rail] 스타일을 확인하지 못했습니다:',
    consoleBuildFail: '[Heading Rail] 인터페이스를 구성하는 중 오류가 발생했습니다:',
    trashNoTitle: '(제목 없음)',
    trashMeta: (lines, path, when) => lines + '줄 · ' + path + ' · ' + when,
    settingLanguageName: '표시 언어',
    settingLanguageDesc: '이 플러그인 화면에 쓰는 언어입니다. 자동을 고르면 Obsidian 자체 설정을 따릅니다.',
    optLanguageAuto: '자동',
    profileDesktop: '컴퓨터',
    profileMobile: '휴대전화',
    mobileProfileHint: '여기 설정은 휴대전화와 태블릿에만 적용됩니다. 설정 옆의 사슬 버튼을 누르면 그 항목만 컴퓨터 값을 가져다 씁니다.',
    linkToDesktop: '컴퓨터 값을 가져다 쓰기',
    unlinkFromDesktop: '휴대전화 전용 값으로 두기',
    resetToTheme: '테마 색으로 되돌리기',
    settingAnchorName: '세로 정렬',
    settingAnchorDesc: '노트 높이에서 막대가 어디에 자리잡을지 정합니다.',
    optAnchorCenter: '가운데',
    optAnchorTop: '위',
    optAnchorBottom: '아래',
    settingSpacingMinName: '최소 간격',
    settingSpacingMinDesc: '막대끼리 이보다 더 가까워지지는 않습니다.',
    settingSpacingMaxName: '최대 간격',
    settingSpacingMaxDesc: '짧은 노트에서도 막대끼리 이보다 더 벌어지지는 않습니다.',
    settingThicknessName: '막대 두께',
    settingThicknessDesc: '막대 하나의 두께입니다(픽셀).',
    settingBarWidthName: '막대 길이',
    settingBarWidthDesc: '가만히 있을 때의 막대 길이를, 제목 단계별 기본값에 대한 비율로 정합니다.',
    settingsSectionWave: '물결',
    settingsSectionWaveFine: '물결 — 세부 조정',
    settingsSectionBars: '막대',
    settingsSectionLevels: '제목 단계별 길이',
    settingsSectionGlow: '현재 위치 강조',
    waveIntro: '매 화면마다 막대마다 숫자 하나가 정해집니다. 물결이 그 막대에 얼마나 닿았는가입니다. 아래의 각 항목은 그 숫자를 따라 가만히 있을 때의 값에서 꼭대기 값까지 옮겨갑니다. 그래서 색은 그대로 두고 길이만, 길이는 그대로 두고 색만, 또는 둘 다 한꺼번에 바꿀 수 있습니다.',
    levelsHint: '가만히 있을 때의 막대 길이(픽셀)입니다. 위에 있는 전체 배율을 곱하기 전의 값입니다.',
    settingPeakModeName: '꼭대기에서의 길이',
    settingPeakModeDesc: '공통 길이는 모든 막대를 같은 길이로 끌어당겨, 물결의 마루가 고르게 나옵니다. 덧붙이기는 각 막대의 원래 길이에 같은 양을 더하므로, 깊은 단계는 여전히 짧게 남습니다.',
    optPeakTarget: '공통 길이',
    optPeakAdd: '원래 길이에 덧붙이기',
    settingPeakLengthName: '중심에서의 길이',
    settingPeakLengthDesc: '물결의 한가운데에서 막대가 얼마나 길어지는지입니다(픽셀).',
    settingPeakAddName: '중심에서의 증가분',
    settingPeakAddDesc: '물결의 한가운데에서 막대에 몇 픽셀을 더할지입니다.',
    settingCurveName: '물결의 모양',
    settingCurveDesc: '물결의 중심에서 가장자리로 갈수록 세기가 어떻게 줄어드는지입니다.',
    optCurveBell: '종 — 부드럽고 경계가 보이지 않음',
    optCurvePeak: '봉우리 — 중심이 뾰족하고 자락이 김',
    optCurvePlateau: '고원 — 꼭대기가 평평하고 옆면이 가파름',
    optCurveCosine: '아치 — 고른 곡선에 깔끔한 끝',
    optCurveWedge: '쐐기 — 곧게 떨어짐',
    optCurveStep: '계단 — 전부 아니면 전무',
    optCurveRipple: '잔물결 — 뒤로 약한 두 번째 물결',
    settingEdgeName: '가장자리의 날카로움',
    settingEdgeDesc: '고른 모양을 미세하게 조정합니다. 값이 클수록 폭이 좁아지고 가장자리가 단단해집니다. 아치, 쐐기, 계단은 이 값을 보지 않습니다.',
    settingPeakBrightName: '꼭대기에서의 밝기',
    settingPeakBrightDesc: '물결 중심에 있는 막대에 물결 색을 얼마나 섞을지입니다. 0이면 색은 그대로 두고 길이만 달라집니다.',
    settingRestBrightName: '가만히 있을 때의 밝기',
    settingRestBrightDesc: '물결이 오지 않은 동안 모든 막대가 띠고 있는 물결 색의 양입니다.',
    settingWaveColorName: '물결의 색',
    settingWaveColorDesc: '물결이 막대에 섞어 넣는 색입니다. 기본값은 테마의 글자색입니다.',
    settingRestOpacityName: '가만히 있을 때의 불투명도',
    settingRestOpacityDesc: '물결이 오지 않은 동안 막대가 얼마나 진한지입니다.',
    settingPeakOpacityName: '꼭대기에서의 불투명도',
    settingPeakOpacityDesc: '물결 중심에 있는 막대가 얼마나 진한지입니다.',
    settingPeakThickName: '꼭대기에서의 두께',
    settingPeakThickDesc: '물결 중심에 있는 막대의 두께를, 가만히 있을 때의 두께에 대한 비율로 정합니다. 100으로 두면 두께가 변하지 않습니다.',
    settingFollowName: '따라잡는 시간',
    settingFollowDesc: '물결이 커서를 따라잡는 데 걸리는 시간입니다(밀리초). 0이면 커서에 딱 붙습니다.',
    settingOvershootName: '지나침',
    settingOvershootDesc: '빠르게 움직였을 때 물결이 커서를 얼마나 지나쳤다가 돌아오는지입니다. 0이면 도착해서 그대로 멈춥니다.',
    settingRiseName: '올라오는 시간',
    settingRiseDesc: '커서가 왔을 때 물결이 온 힘에 이르기까지 걸리는 시간입니다.',
    settingFallName: '사그라드는 시간',
    settingFallDesc: '커서가 떠난 뒤 물결이 사그라드는 데 걸리는 시간입니다. 0이면 곧바로 사라집니다.',
    settingLevelWidthName: (n) => '제목 ' + n + '단계',
    settingCapWidthName: '끝 표시',
    settingCapWidthDesc: '노트의 처음과 끝을 알리는 짧은 막대 두 개의 길이입니다.',
    optGlowOff: '끔',
    settingReachName: '물결이 닿는 범위',
    settingReachDesc: '커서에서 물결이 막대 몇 개만큼 퍼지는지입니다.',
    settingHorizontalName: '옆으로의 움직임에 반응',
    settingHorizontalDesc: '커서가 가장자리에서 옆으로 멀어질수록 막대가 더 길어집니다.',
    settingHorizontalRangeName: '옆으로의 거리',
    settingHorizontalRangeDesc: '막대가 온전한 길이에 이르려면 커서가 가장자리에서 얼마나 멀어져야 하는지입니다.',
    settingPreviewTriggerName: '미리보기를 띄우는 곳',
    settingPreviewTriggerDesc: '어느 부분에서 미리보기 카드가 나오게 할지입니다.',
    optTriggerBoth: '막대와 목차 모두',
    settingPreviewPlaceName: '미리보기 위치',
    settingPreviewPlaceDesc: '자동으로 두면 목차가 열려 있는 동안 카드가 목차 옆으로 비켜서, 목록을 가리지 않습니다.',
    optPlaceAuto: '자동',
    optPlaceRail: '막대 옆',
    optPlaceOutline: '목차 옆',
    settingPreviewBgName: '미리보기 배경',
    settingIntensityName: '물결의 세기',
    settingIntensityDesc: '나머지 모든 설정 위에 놓인 하나의 조절기입니다. 길이, 밝기, 불투명도, 두께, 그리고 조금 약하게는 닿는 범위까지 한꺼번에 끌어올립니다. 0으로 두면 막대가 전혀 반응하지 않습니다. 아래 항목들이 물결의 성격을 정한다면, 이것은 소리의 크기만 정합니다.',
    settingRailFromName: '레일의 시작',
    settingRailFromDesc: '레일의 위쪽 끝을 노트 높이에 대한 비율로 정합니다.',
    settingRailToName: '레일의 끝',
    settingRailToDesc: '레일의 아래쪽 끝을 노트 높이에 대한 비율로 정합니다. 위 설정과 함께 막대가 놓이는 띠가 정해집니다. 막대가 적어 띠를 다 채우지 못할 때 그 안 어디에 놓일지는 세로 정렬이 정합니다.',
    panelWaveHint: '꼭대기에서는 막대가 레일보다 길어지므로, 목차를 열어 두면 목록 위에 걸칩니다. 이 두 스위치는 그 상태에서 막대를 멈춰 둘지 정합니다. 움직이게 두면, 막대가 차지하는 만큼 목차가 옆으로 비켜납니다.',
    settingWavePinnedName: '목차를 고정한 동안에도 움직이기',
    settingWavePinnedDesc: '끄면 목차가 고정되어 있는 동안 막대는 가만히 있을 때의 길이를 유지합니다.',
    settingWavePeekName: 'Ctrl을 누르는 동안에도 움직이기',
    settingWavePeekDesc: '끄면 Ctrl로 목차를 살짝 볼 때 막대가 움직이지 않습니다.',
    linkedNote: '지금은 컴퓨터 값을 쓰고 있습니다. 사슬 버튼을 누르면 휴대전화만의 값이 됩니다.',
    settingPreviewGapName: '막대와의 거리',
    settingPreviewGapDesc: '레일과 미리보기 카드 사이의 간격입니다(픽셀). 꼭대기의 막대가 차지하는 폭은 저절로 더해지므로, 가장 긴 막대가 카드 위에 걸치는 일은 없습니다.',
    settingPreviewWidthName: '카드 너비',
    settingPreviewWidthDesc: '미리보기 카드의 너비입니다(픽셀). 창 너비를 넘지는 않습니다.',
    settingsSectionPreviewType: '미리보기 글자',
    previewTypeHint: '맨 위 세 글꼴은 Obsidian 자체에 설정된 것입니다. 따로 고르지 않아도 카드를 노트나 화면의 글자에 맞출 수 있습니다.',
    optFontInterface: 'Obsidian 화면 글꼴',
    optFontText: 'Obsidian 본문 글꼴',
    optFontMono: 'Obsidian 고정폭 글꼴',
    optFontSystem: '시스템',
    optFontSans: '산세리프',
    optFontSerif: '세리프',
    optFontSlab: '슬래브 세리프',
    optFontMonospace: '고정폭',
    settingPreviewTitleFontName: '제목 글꼴',
    settingPreviewTitleSizeName: '제목 크기',
    settingPreviewTitleWeightName: '제목 굵기',
    settingPreviewTextFontName: '본문 글꼴',
    settingPreviewTextSizeName: '본문 크기',
    settingPreviewTextWeightName: '본문 굵기',
    settingPreviewLineName: '줄 간격',
    settingPreviewLineDesc: '미리보기 본문의 줄 높이를 글자 크기에 대한 비율로 정합니다.',
    settingSpanName: '물결에 드는 막대 수',
    settingSpanDesc: (span, side) => '언제나 홀수입니다. 가운데 하나와 양쪽에 ' + side + '개씩. 지금은 ' + span + '개.',
    settingsSectionSteps: '단계별 길이',
    stepsHint: '조절기 하나하나가 물결이 가장 셀 때 막대 하나의 길이(픽셀)입니다. 가운데는 커서 아래의 막대이고, 나머지는 그 위아래로 대칭입니다.',
    settingStepCenterName: '가운데 막대',
    settingStepName: (d) => '가운데에서 ' + d + '번째',
    settingSharpName: '또렷한 중심',
    settingSharpDesc: '커서에 가장 가까운 막대가 언제나 온전한 길이에 이르고, 나머지는 반드시 그보다 짧게 남습니다. 끄면 커서가 걸쳐 있는 두 막대가 세기를 나눠 가져, 가리키는 막대보다 옆 막대가 더 길어질 수 있습니다.',
    settingReactZoneName: '반응하는 범위',
    settingReactZoneDesc: '레일에서 얼마나 떨어진 곳부터 막대가 반응하기 시작할지입니다(픽셀). 범위의 바깥쪽에서는 세기가 부드럽게 0으로 잦아들어, 물결이 불쑥 나타나지 않고 커서를 마중 나옵니다. 0이면 커서가 레일 위에 올라선 뒤에야 반응합니다.',
    settingHorizontalMinName: '화면 끝에서의 세기',
    settingHorizontalMinDesc: '커서가 창 가장자리에 붙어 있을 때 물결이 얼마나 센지를 최대에 대한 비율로 정합니다. 값이 낮을수록 본문 쪽으로 움직이기 전까지 레일이 얌전해 보입니다.',
    settingCapsModeName: '끝 표시',
    settingCapsModeDesc: '노트의 처음과 끝을 나타내는 짧은 막대 두 개입니다.',
    optCapsOn: '보이고, 누를 수 있음',
    optCapsQuiet: '보이지만 누를 수 없음',
    optCapsOff: '아예 없애기',
    optCurveCustom: '직접 그린 모양(픽셀로 지정)',
    settingCenterModeName: '물결의 중심을 두는 방식',
    settingCenterModeDesc: '막대에 맞추기 — 막대 사이의 빈 자리를 정확히 반으로 가릅니다. 커서가 한 막대 위에 있는 동안에는 아무것도 움직이지 않습니다. 반을 넘어서면 커서를 따라올 때와 똑같이 부드럽게 다음 막대로 옮겨갑니다. 자유롭게 — 중심이 커서 바로 아래에 놓여, 커서가 걸쳐 있는 두 막대가 물결을 나눠 가지고 작은 움직임에도 둘 다 흔들립니다.',
    optCenterSnap: '막대에 맞추기',
    optCenterFree: '자유롭게, 커서 바로 아래',
    settingRailEdgeName: '창 가장자리에서의 거리',
    settingRailEdgeDesc: '레일 전체를 노트 가장자리에서 얼마나 떼어 놓을지입니다(픽셀).',
    settingColGapName: '열 사이 간격',
    settingColGapDesc: '한 열로는 모자란 긴 노트에서, 막대 열 사이를 얼마나 벌릴지입니다(픽셀).',
    settingLevelThickName: (n) => n + '단계 — 두께',
    settingLevelFadeName: (n) => n + '단계 — 불투명도',
    settingGlowLiftName: '강조가 막대를 앞으로 끌어냄',
    settingGlowLiftDesc: '강조가 막대를 온전한 불투명도 쪽으로 얼마나 끌어올릴지를 비율로 정합니다. 이것이 없을 때는 강조가 전체 불투명도와 곱해져 거의 사라졌고, 그래서 현재 막대만 빛나는 것처럼 보였습니다.',
    settingGlowColorName: '강조의 색',
    settingGlowColorDesc: '현재 위치 강조의 색입니다. 기본값은 현재 제목의 색입니다.',
    settingsSectionPresets: '미리 만들어 둔 스타일',
    presetsHint: '스타일은 한꺼번에 적용되는 값의 묶음입니다. 하나 골라 적용한 뒤 거기서부터 계속 다듬으면 됩니다. 잠기는 것은 없습니다. 다른 사람이 보내온 스타일은 제작자가 확인한 뒤 여기에 더해집니다.',
    settingPresetName: '스타일',
    settingPresetDesc: '지금 고치고 있는 쪽의 설정에만 적용됩니다. 스타일에 없는 항목은 쓰던 그대로 남습니다.',
    presetApply: '적용',
    presetApplied: (name) => '스타일을 적용했습니다: ' + name,
    settingShareName: '내 스타일 보내기',
    settingShareDesc: '마음에 드는 설정에 이르렀다면 보내주셔도 됩니다. 확인을 거친 스타일은 다음 판에서 목록에 더해집니다.',
    shareOpen: '보내기…',
    shareTitle: '내 스타일 보내기',
    shareIntro: '아래는 지금 쓰고 있는 값의 묶음입니다. 복사해서 메일로 보내주세요. 저절로 어딘가로 보내지는 일은 없습니다. 플러그인은 내용을 채운 메일 앱을 열어줄 뿐입니다.',
    shareCopy: '설정 복사',
    shareCopied: '설정을 클립보드에 복사했습니다',
    shareCopyManual: '선택된 글을 직접 복사해 주세요',
    shareMail: '메일 열기',
    shareSubject: 'Heading Rail — 살펴봐 주셨으면 하는 스타일',
    shareBody: '복사한 설정을 이 줄 아래에 붙여 넣어 주세요. 스타일 이름을 생각해 두셨다면 함께 적어 주세요.\n\n',
    shareNote: '들어가는 것은 플러그인 설정값뿐입니다. 노트 본문도, 파일 이름도, 보관함 안의 다른 어떤 것도 포함되지 않습니다.',
    contactLine: '이 플러그인이나 다른 플러그인에 대한 생각이 있으시면 제작자에게:',
    settingPreviewTitleColorName: '제목 색',
    settingPreviewTextColorName: '본문 색',
    settingsSectionPanelLook: '목차 색',
    settingPanelBgName: '목차 배경',
    settingPanelTextName: '목차 글자',
    settingPanelActiveTextName: '현재 항목',
    presetBase: 'Base',
    glowHint: '서로 다른 두 가지이고, 각각 따로 켜고 끕니다. 하나는 현재 막대, 다른 하나는 그 둘레의 무리입니다. 무리를 정하는 방식은 막대 길이와 같습니다. 몇 개까지 닿는지, 단계마다 얼마나 밝은지를 위아래 같은 값으로 정합니다.',
    settingActiveGlowName: '현재 막대 강조',
    settingActiveGlowDesc: '지금 자신이 있는 제목의 막대입니다.',
    optGlowAlways: '항상',
    optGlowHover: '레일을 가리키는 동안만',
    optGlowTouch: '레일에 손가락이 닿아 있는 동안만',
    settingHaloModeName: '둘레의 무리',
    settingHaloModeDesc: '현재 막대의 이웃들이, 멀어질수록 옅어집니다.',
    settingHaloSpanName: '무리에 드는 막대 수',
    settingHaloSpanDesc: (span, side) => '언제나 홀수입니다. 현재 막대와 양쪽에 ' + side + '개씩. 지금은 ' + span + '개.',
    settingsSectionHaloSteps: '단계별 밝기',
    haloStepsHint: '현재 막대에서 떨어진 거리마다 얼마나 밝게 할지를 비율로 정합니다. 1단계는 바로 옆 막대이고, 같은 값이 위아래에 함께 쓰입니다.',
    settingHaloStepName: (d) => d + '단계',
    colourHint: '색은 저마다 자기 불투명도와 같은 줄에 놓여 있고, 오른쪽 화살표를 누르면 그 색을 테마에 돌려줍니다.',
    settingCapThickName: '끝 표시 — 두께',
    settingCapOpacityName: '끝 표시 — 불투명도',
    settingPanelGapName: '막대와의 거리',
    settingPanelGapDesc: '레일과 목차 목록 사이의 간격입니다(픽셀).',
    settingsSectionPreviewLook: '미리보기 색',
    settingMobileOnName: '이 휴대전화에서 플러그인 쓰기',
    settingMobileOnDesc: 'Obsidian에는 화면 가장자리에서 시작하는 자체 쓸어넘기기 동작이 있고, 그것이 레일을 가로채기도 합니다. 그 때문에 휴대전화에서 도움보다 번거로움이 크다면 여기서 꺼 두세요. 컴퓨터 쪽은 그대로 동작합니다.',
    mobileOffHint: '휴대전화에서는 레일을 꺼 두었습니다. 나머지 휴대전화 설정은 여기서 할 일이 없어 숨겨 두었습니다.',
    settingFollowThemeName: '테마에 맞추기',
    settingFollowThemeDesc: '미리 만든 스타일에서 온 색은 밝은 바탕에 밝은 색, 어두운 바탕에 어두운 색이 되지 않도록 손봅니다. 스타일 제작자는 자기 테마에 맞춰 골랐을 뿐 여러분의 테마는 모르기 때문입니다. 직접 정한 색은 절대 건드리지 않습니다. 바탕과 거의 같아졌더라도 그대로 둡니다.',
    settingRadiusName: '모서리 둥글기',
    settingRadiusDesc: '플러그인이 그리는 모든 것에 쓰이는 하나의 값입니다. 미리보기 카드, 목차 목록, 검색창이 해당합니다.',
    settingActiveMoveName: '현재 막대가 바뀔 때',
    settingActiveMoveDesc: '건너뛰기 — 강조가 새 자리에 곧바로 나타납니다. 이동 — 그곳까지 움직이며 뒤로 옅어지는 자취를 남깁니다. 목차를 눌러 옮길 때 강조가 갑작스럽게 느껴지는 것은 레일의 절반을 단번에 뛰어넘기 때문입니다.',
    optMoveTravel: '새 자리까지 이동',
    optMoveInstant: '곧바로 건너뛰기',
    settingTravelTimeName: '이동 시간',
    settingTravelTimeDesc: '강조가 목적지에 닿기까지 걸리는 시간입니다(밀리초).',
    settingTravelOvershootName: '도착할 때의 지나침',
    settingTravelOvershootDesc: '목적지를 얼마나 지나쳤다가 자리를 잡는지입니다.',
    settingTravelTrailName: '지나는 길의 자취',
    settingTravelTrailDesc: '지나치는 막대들이 얼마나 밝게 빛나는지입니다. 0이면 자취 없이 그냥 옮겨갑니다.',
    shareNameName: '스타일 이름',
    shareNameDesc: '선택 사항입니다. 메일에 들어가서 스타일에 부를 이름이 생깁니다.',
    shareNamePlaceholder: '예: Night Ruler',
    shareWhichName: '보낼 내용',
    shareWhichDesc: '메일 안에서 묶음마다 이름이 붙으므로 컴퓨터와 휴대전화가 섞이지 않습니다.',
    shareBoth: '둘 다 — 컴퓨터와 휴대전화',
    presetStateOn: (name) => '지금 쓰는 중: ' + name + '.',
    presetStateChanged: (name) => '지금 쓰는 중: ' + name + '. 그 위에 직접 바꾼 값이 있습니다.',
    presetRestore: '스타일로 되돌리기',
    settingScrollToName: '제목이 멈추는 자리',
    settingScrollToDesc: '레일이나 목차에서 제목으로 건너뛸 때, 화면의 어디에 그 제목이 오는지입니다.',
    optScrollTop: '화면 위',
    optScrollUpper: '높이의 삼분의 일쯤',
    optScrollCenter: '화면 가운데',
    contributeLine: '정말 더 나은 포크를 만드셨다면 소스와 구현 방법을 보내주세요. 실제로 더 낫다면 다음 판에 반영하고 공동 제작자로 이름을 올리겠습니다. 코드는 제가 손볼 수 있지만, 바탕으로 삼았다면 어떤 경우든 이름을 올립니다.',
  },
  hi: {
    tocTooltip: 'नोट संरचना',
    trashTooltip: 'सेक्शन इतिहास',
    searchPlaceholder: 'संरचना में खोजें',
    startOfDoc: 'दस्तावेज़ की शुरुआत',
    endOfDoc: 'दस्तावेज़ का अंत',
    jumpAboveLabel: 'मौजूदा स्थिति ऊपर है — दिखाएं',
    jumpBelowLabel: 'मौजूदा स्थिति नीचे है — दिखाएं',
    delete: 'हटाएं',
    deleteN: (n) => 'हटाएं (' + n + ')',
    copy: 'कॉपी करें',
    copyN: (n) => 'कॉपी करें (' + n + ')',
    copyAgain: 'फिर से कॉपी करें',
    cancel: 'रद्द करें',
    restore: 'पुनर्स्थापित करें',
    forget: 'हटा दें',
    historyTitle: 'सेक्शन इतिहास',
    trashCopiedHead: 'कॉपी किया गया',
    trashCopiedEmpty: 'अभी तक कुछ भी कॉपी नहीं किया गया है।',
    trashDeletedHead: 'हटाया गया',
    trashDeletedEmpty: 'अभी तक कुछ भी हटाया नहीं गया है।',
    trashHint: 'सबसे नए सबसे ऊपर। यदि हटाने के बाद फ़ाइल संपादित की गई थी, तो पहले हाल की प्रविष्टियों को पुनर्स्थापित करें।',
    settingSearchName: 'खोज फ़ील्ड',
    settingSearchDesc: 'विस्तारित संरचना के बगल में एक खोज बॉक्स दिखाएं।',
    settingSearchBottomName: 'खोज नीचे रखें',
    settingSearchBottomDesc: 'स्थान बदलें: खोज संरचना के नीचे, संरचना ऊपर।',
    settingTrashMaxName: 'कितने हटाए गए रखें',
    settingTrashMaxDesc: 'हटाए गए सेक्शन की सूची में कितनी प्रविष्टियां रखनी हैं।',
    cmdDeleteSelected: 'चुने गए सेक्शन हटाएं',
    cmdCopySelected: 'चुने गए सेक्शन कॉपी करें',
    cmdRestoreLast: 'अंतिम हटाई गई प्रविष्टि पुनर्स्थापित करें',
    noticeReadFail: 'Heading Rail: फ़ाइल पढ़ी नहीं जा सकी',
    noticeStale: 'संरचना पुरानी हो चुकी है — सूची ताज़ा करें और फिर से प्रयास करें',
    noticeDeleted: (sections, lines) => 'हटाए गए सेक्शन: ' + sections + ', पंक्तियां: ' + lines,
    noticeNothingToRestore: 'पुनर्स्थापित करने के लिए कुछ भी नहीं है',
    noticeFileNotFound: 'फ़ाइल नहीं मिली',
    noticeReadFail2: 'फ़ाइल पढ़ी नहीं जा सकी',
    noticeChangedAfterDelete: 'इस हटाने के बाद फ़ाइल बदल गई। पहले हाल की प्रविष्टियों को पुनर्स्थापित करें, या Ctrl+Z का उपयोग करें।',
    noticeRestored: 'हटाई गई प्रविष्टि पुनर्स्थापित की गई',
    noticeCopied: (sections, lines) => 'कॉपी किए गए सेक्शन: ' + sections + ', पंक्तियां: ' + lines,
    noticeCopyFail: 'क्लिपबोर्ड में कॉपी नहीं हो सका',
    noticeRestoreFail: (msg) => 'पुनर्स्थापित नहीं हो सका: ' + msg,
    settingsSectionLayout: 'लेआउट',
    settingsSectionColour: 'रंग',
    settingsSectionPreview: 'होवर पर पूर्वावलोकन',
    settingsSectionOutline: 'संरचना',
    settingSideName: 'दिशा',
    settingSideDesc: 'नोट के किस किनारे पर पट्टियां लगाई जाएं।',
    optRight: 'दाईं ओर',
    optLeft: 'बाईं ओर',
    settingSpacingName: 'पट्टियों के बीच की दूरी',
    settingSpacingDesc: 'अनुकूली उपलब्ध ऊंचाई के अनुसार पट्टियों को फैलाता है। स्थिर हेडिंग की संख्या चाहे जो भी हो, वही दूरी बनाए रखता है।',
    optAdaptive: 'अनुकूली',
    optFixed: 'स्थिर',
    settingFixedSpacingName: 'स्थिर दूरी',
    settingFixedSpacingDesc: 'पट्टियों के बीच की दूरी, पिक्सेल में।',
    settingHoverScrollName: 'होवर पर स्क्रॉल',
    settingHoverScrollDesc: 'बिना क्लिक किए, कर्सर के पट्टियों के ऊपर से गुजरते ही दस्तावेज़ को स्क्रॉल करें।',
    settingBarColorName: 'पट्टी का रंग',
    settingBarColorDesc: 'थीम का रंग अपनाने के लिए खाली छोड़ें। कोई भी CSS रंग काम करता है।',
    settingActiveColorName: 'सक्रिय पट्टी का रंग',
    settingActiveColorDesc: 'मौजूदा स्थिति दर्शाने वाली पट्टी का रंग। खाली छोड़ने पर थीम का एक्सेंट रंग उपयोग होता है।',
    settingGradientName: 'ग्रेडिएंट',
    settingGradientDesc: 'रेल के साथ पट्टियों को एक रंग से दूसरे रंग में बदलें। यह ऊपर दिए गए पट्टी रंग को अधिलेखित करता है।',
    settingGradientStartName: 'ग्रेडिएंट की शुरुआत',
    settingGradientEndName: 'ग्रेडिएंट का अंत',
    settingPreviewToggleName: 'पूर्वावलोकन दिखाएं',
    settingPreviewToggleDesc: 'होवर करने पर शीर्षक और उसके पाठ की शुरुआत दिखाने वाला एक छोटा कार्ड।',
    optPreviewOff: 'न दिखाएं',
    optPreviewBars: 'पट्टियों पर',
    optPreviewOutline: 'संरचना पर',
    settingPreviewLenName: 'पूर्वावलोकन की लंबाई',
    settingPreviewLenDesc: 'सेक्शन के पाठ के कितने अक्षर दिखाने हैं।',
    errWriteConflict: 'कार्य के दौरान फ़ाइल बदल गई, कृपया फिर से प्रयास करें',
    noticeModifyFail: (msg) => 'Heading Rail: ' + (msg || 'फ़ाइल संशोधित नहीं हो सकी'),
    consoleFallbackCss: '[Heading Rail] main.js के पास styles.css नहीं मिली — अंतर्निर्मित प्रति उपयोग की जा रही है।',
    consoleStyleCheckFail: '[Heading Rail] स्टाइल जांची नहीं जा सकीं:',
    consoleBuildFail: '[Heading Rail] इंटरफ़ेस बनाते समय त्रुटि हुई:',
    trashNoTitle: '(शीर्षक रहित)',
    trashMeta: (lines, path, when) => lines + ' पंक्तियां · ' + path + ' · ' + when,
    settingLanguageName: 'भाषा',
    settingLanguageDesc: 'इस प्लगइन की भाषा। स्वचालित चुनने पर Obsidian की अपनी सेटिंग के अनुसार चलेगी।',
    optLanguageAuto: 'स्वचालित',
    profileDesktop: 'कंप्यूटर',
    profileMobile: 'फ़ोन',
    mobileProfileHint: 'ये सेटिंग्स केवल फ़ोन और टैबलेट पर लागू होती हैं। किसी सेटिंग के बगल वाले कड़ी बटन से वह सेटिंग कंप्यूटर वाला मान लेने लगती है।',
    linkToDesktop: 'कंप्यूटर वाला मान लें',
    unlinkFromDesktop: 'फ़ोन के लिए अलग मान रखें',
    resetToTheme: 'थीम के रंग पर लौटें',
    settingAnchorName: 'ऊँचाई में जगह',
    settingAnchorDesc: 'नोट की ऊँचाई में पट्टियाँ कहाँ बैठेंगी।',
    optAnchorCenter: 'बीच में',
    optAnchorTop: 'ऊपर',
    optAnchorBottom: 'नीचे',
    settingSpacingMinName: 'सबसे कम अंतर',
    settingSpacingMinDesc: 'पट्टियाँ इससे ज़्यादा पास कभी नहीं आतीं।',
    settingSpacingMaxName: 'सबसे ज़्यादा अंतर',
    settingSpacingMaxDesc: 'छोटे नोट में भी पट्टियाँ इससे ज़्यादा दूर नहीं जातीं।',
    settingThicknessName: 'पट्टी की मोटाई',
    settingThicknessDesc: 'हर पट्टी कितनी मोटी है, पिक्सेल में।',
    settingBarWidthName: 'पट्टी की लंबाई',
    settingBarWidthDesc: 'शांत अवस्था में पट्टी की लंबाई, हर शीर्षक स्तर के डिफ़ॉल्ट मान के प्रतिशत में।',
    settingsSectionWave: 'लहर',
    settingsSectionWaveFine: 'लहर — बारीक समायोजन',
    settingsSectionBars: 'पट्टियाँ',
    settingsSectionLevels: 'शीर्षक स्तर के अनुसार लंबाई',
    settingsSectionGlow: 'वर्तमान स्थान की चमक',
    waveIntro: 'हर फ़्रेम में प्रत्येक पट्टी को एक संख्या मिलती है: लहर उस तक कितनी पहुँची। नीचे दी गई हर विशेषता उसी संख्या के साथ शांत मान से शिखर मान तक जाती है। इसलिए बिना रंग के केवल लंबाई, बिना लंबाई के केवल रंग, या दोनों एक साथ — सब संभव है।',
    levelsHint: 'शांत अवस्था में पट्टी की लंबाई पिक्सेल में, ऊपर दिए साझा गुणक से पहले।',
    settingPeakModeName: 'शिखर पर लंबाई',
    settingPeakModeDesc: 'साझा लंबाई सभी पट्टियों को एक ही लंबाई की ओर खींचती है, जिससे लहर का शिखर एकसार बनता है। बढ़त हर पट्टी की अपनी लंबाई में उतना ही जोड़ती है, इसलिए गहरे स्तर छोटे ही रहते हैं।',
    optPeakTarget: 'साझा लंबाई',
    optPeakAdd: 'अपनी लंबाई में बढ़त',
    settingPeakLengthName: 'केंद्र पर लंबाई',
    settingPeakLengthDesc: 'लहर के ठीक केंद्र पर पट्टी कितनी लंबी होती है, पिक्सेल में।',
    settingPeakAddName: 'केंद्र पर बढ़त',
    settingPeakAddDesc: 'लहर के ठीक केंद्र पर पट्टी में कितने पिक्सेल जुड़ते हैं।',
    settingCurveName: 'लहर का आकार',
    settingCurveDesc: 'लहर के केंद्र से किनारों तक ताक़त किस तरह घटती है।',
    optCurveBell: 'घंटी — कोमल, बिना दिखने वाले किनारे के',
    optCurvePeak: 'शिखर — तीखा केंद्र, लंबी पूँछें',
    optCurvePlateau: 'पठार — सपाट चोटी, खड़ी ढलानें',
    optCurveCosine: 'चाप — एकसार वक्र, साफ़ किनारा',
    optCurveWedge: 'कील — सीधी गिरावट',
    optCurveStep: 'सीढ़ी — या पूरा या कुछ नहीं',
    optCurveRipple: 'तरंग — पीछे एक दूसरी, हल्की लहर',
    settingEdgeName: 'किनारों की तीखापन',
    settingEdgeDesc: 'चुने हुए आकार का बारीक समायोजन: मान बढ़ाने पर आकार सँकरा और किनारे कड़े हो जाते हैं। चाप, कील और सीढ़ी इसे नहीं देखते।',
    settingPeakBrightName: 'शिखर पर चमक',
    settingPeakBrightDesc: 'लहर के केंद्र पर पट्टी में लहर का रंग कितना मिलाया जाए। शून्य पर रंग वैसा ही रहता है और केवल लंबाई बदलती है।',
    settingRestBrightName: 'शांत अवस्था में चमक',
    settingRestBrightDesc: 'जब तक लहर नहीं आई, सभी पट्टियाँ लहर का रंग कितना लिए रहती हैं।',
    settingWaveColorName: 'लहर का रंग',
    settingWaveColorDesc: 'वह रंग जो लहर पट्टियों में मिलाती है। डिफ़ॉल्ट रूप से आपकी थीम का पाठ रंग।',
    settingRestOpacityName: 'शांत अवस्था में अपारदर्शिता',
    settingRestOpacityDesc: 'जब तक लहर नहीं आई, पट्टियाँ कितनी गहरी दिखती हैं।',
    settingPeakOpacityName: 'शिखर पर अपारदर्शिता',
    settingPeakOpacityDesc: 'लहर के केंद्र पर पट्टी कितनी गहरी दिखती है।',
    settingPeakThickName: 'शिखर पर मोटाई',
    settingPeakThickDesc: 'लहर के केंद्र पर पट्टी की मोटाई, शांत अवस्था की मोटाई के प्रतिशत में। 100 रखने पर मोटाई नहीं बदलती।',
    settingFollowName: 'पकड़ने का समय',
    settingFollowDesc: 'लहर को कर्सर तक पहुँचने में कितना समय लगता है, मिलीसेकंड में। शून्य पर वह कर्सर से चिपकी रहती है।',
    settingOvershootName: 'आगे निकलना',
    settingOvershootDesc: 'तेज़ गति पर लहर कर्सर से कितना आगे निकलकर लौटती है। शून्य पर वह पहुँचकर रुक जाती है।',
    settingRiseName: 'उठान',
    settingRiseDesc: 'कर्सर आने पर लहर को पूरी ताक़त तक पहुँचने में कितना समय लगता है।',
    settingFallName: 'ढलान',
    settingFallDesc: 'कर्सर हटने के बाद लहर को बुझने में कितना समय लगता है। शून्य पर वह तुरंत लौट आती है।',
    settingLevelWidthName: (n) => 'शीर्षक स्तर ' + n,
    settingCapWidthName: 'छोर के निशान',
    settingCapWidthDesc: 'नोट की शुरुआत और अंत बताने वाली दो छोटी पट्टियों की लंबाई।',
    optGlowOff: 'बंद',
    settingReachName: 'लहर की पहुँच',
    settingReachDesc: 'कर्सर से लहर कितनी पट्टियों तक फैलती है।',
    settingHorizontalName: 'बग़ल की गति पर प्रतिक्रिया',
    settingHorizontalDesc: 'कर्सर किनारे से बग़ल की ओर जितना हटता है, पट्टियाँ उतनी और बढ़ती हैं।',
    settingHorizontalRangeName: 'बग़ल की दूरी',
    settingHorizontalRangeDesc: 'पट्टियों को पूरी लंबाई तक पहुँचाने के लिए कर्सर को किनारे से कितनी दूर जाना होगा।',
    settingPreviewTriggerName: 'झलक कहाँ से आए',
    settingPreviewTriggerDesc: 'विजेट के किस हिस्से से झलक वाला कार्ड निकलता है।',
    optTriggerBoth: 'पट्टियाँ और रूपरेखा, दोनों',
    settingPreviewPlaceName: 'झलक की जगह',
    settingPreviewPlaceDesc: 'स्वचालित रखने पर, रूपरेखा खुली होने तक कार्ड उसके बगल में चला जाता है और सूची को नहीं ढकता।',
    optPlaceAuto: 'स्वचालित',
    optPlaceRail: 'पट्टियों के पास',
    optPlaceOutline: 'रूपरेखा के पास',
    settingPreviewBgName: 'झलक की पृष्ठभूमि',
    settingIntensityName: 'लहर की तीव्रता',
    settingIntensityDesc: 'बाकी सब पर एक ही स्लाइडर: यह लंबाई, चमक, अपारदर्शिता, मोटाई और — कुछ हल्के ढंग से — पहुँच, सबको एक साथ खींचता है। शून्य पर पट्टियाँ बिलकुल प्रतिक्रिया नहीं करतीं। नीचे की सेटिंग्स लहर का स्वभाव बताती हैं, यह केवल उसकी ऊँची आवाज़।',
    settingRailFromName: 'पट्टी-पंक्ति यहाँ से शुरू',
    settingRailFromDesc: 'पंक्ति का ऊपरी किनारा, नोट की ऊँचाई के प्रतिशत में।',
    settingRailToName: 'पट्टी-पंक्ति यहाँ तक',
    settingRailToDesc: 'पंक्ति का निचला किनारा, नोट की ऊँचाई के प्रतिशत में। ऊपर वाली सेटिंग के साथ मिलकर वह पट्टी बनती है जिसमें पट्टियाँ रहती हैं। पट्टियाँ कम हों और वह जगह न भरें, तो उनमें से कहाँ बैठेंगी यह ऊँचाई में जगह तय करती है।',
    panelWaveHint: 'शिखर पर पट्टी पंक्ति से लंबी हो जाती है, इसलिए रूपरेखा खुली हो तो वह सूची पर आ पड़ती है। ये दो स्विच बताते हैं कि उस अवस्था में पट्टियाँ रुकी रहेंगी या नहीं। चलती रहें, तो पट्टियाँ जितनी जगह लेती हैं, उतनी ही रूपरेखा बग़ल में खिसक जाती है।',
    settingWavePinnedName: 'रूपरेखा टिकी हो तब भी चले',
    settingWavePinnedDesc: 'बंद रखने पर, जब तक रूपरेखा टिकी है पट्टियाँ अपनी शांत लंबाई पर रहती हैं।',
    settingWavePeekName: 'Ctrl दबाए रखने पर भी चले',
    settingWavePeekDesc: 'बंद रखने पर, Ctrl से रूपरेखा झाँकते समय पट्टियाँ स्थिर रहती हैं।',
    linkedNote: 'अभी कंप्यूटर वाला मान ले रही है — कड़ी बटन दबाने पर फ़ोन को अपना मान मिल जाएगा।',
    settingPreviewGapName: 'पट्टियों से दूरी',
    settingPreviewGapDesc: 'पंक्ति और झलक वाले कार्ड के बीच की दूरी, पिक्सेल में। शिखर पर पट्टियाँ जितनी जगह लेती हैं, वह अपने आप जुड़ जाती है, इसलिए सबसे लंबी पट्टी कार्ड पर कभी नहीं पड़ती।',
    settingPreviewWidthName: 'कार्ड की चौड़ाई',
    settingPreviewWidthDesc: 'झलक वाले कार्ड की चौड़ाई पिक्सेल में, खिड़की की चौड़ाई तक सीमित।',
    settingsSectionPreviewType: 'झलक की टाइपोग्राफ़ी',
    previewTypeHint: 'पहले तीन फ़ॉन्ट वही हैं जो Obsidian में सेट हैं। इसलिए बिना कुछ चुने ही कार्ड को नोट या इंटरफ़ेस से मिलाया जा सकता है।',
    optFontInterface: 'Obsidian का इंटरफ़ेस फ़ॉन्ट',
    optFontText: 'Obsidian का पाठ फ़ॉन्ट',
    optFontMono: 'Obsidian का एकसमान-चौड़ाई फ़ॉन्ट',
    optFontSystem: 'सिस्टम',
    optFontSans: 'बिना सेरिफ़',
    optFontSerif: 'सेरिफ़ के साथ',
    optFontSlab: 'चौकोर सेरिफ़',
    optFontMonospace: 'एकसमान चौड़ाई',
    settingPreviewTitleFontName: 'शीर्षक का फ़ॉन्ट',
    settingPreviewTitleSizeName: 'शीर्षक का आकार',
    settingPreviewTitleWeightName: 'शीर्षक की मोटाई',
    settingPreviewTextFontName: 'पाठ का फ़ॉन्ट',
    settingPreviewTextSizeName: 'पाठ का आकार',
    settingPreviewTextWeightName: 'पाठ की मोटाई',
    settingPreviewLineName: 'पंक्ति अंतराल',
    settingPreviewLineDesc: 'झलक के पाठ की पंक्ति ऊँचाई, उसके फ़ॉन्ट आकार के प्रतिशत में।',
    settingSpanName: 'लहर में पट्टियाँ',
    settingSpanDesc: (span, side) => 'हमेशा विषम: बीच में एक और हर ओर ' + side + '। अभी ' + span + '।',
    settingsSectionSteps: 'हर सीढ़ी की लंबाई',
    stepsHint: 'हर स्लाइडर पूरी लहर पर एक पट्टी की लंबाई है, पिक्सेल में। केंद्र वह पट्टी है जिस पर कर्सर है, बाकी उसके ऊपर और नीचे बराबर बँटी हैं।',
    settingStepCenterName: 'बीच की पट्टी',
    settingStepName: (d) => 'केंद्र से ' + d + ' दूर',
    settingSharpName: 'स्पष्ट केंद्र',
    settingSharpDesc: 'कर्सर के सबसे पास वाली पट्टी हमेशा पूरी लंबाई तक पहुँचती है और बाकी निश्चित रूप से छोटी रहती हैं। बंद करने पर जिन दो पट्टियों के बीच कर्सर है वे ताक़त बाँट लेती हैं, और पड़ोसी पट्टी उससे लंबी हो सकती है जिस पर आप इशारा कर रहे हैं।',
    settingReactZoneName: 'प्रतिक्रिया का दायरा',
    settingReactZoneDesc: 'पंक्ति से कितनी दूरी पर पट्टियाँ प्रतिक्रिया शुरू करें, पिक्सेल में। दायरे के बाहरी किनारे पर ताक़त धीरे-धीरे शून्य हो जाती है, इसलिए लहर अचानक प्रकट नहीं होती बल्कि कर्सर से मिलने आती है। शून्य का अर्थ है कि पट्टियाँ तभी जागेंगी जब कर्सर पंक्ति के ऊपर आ जाए।',
    settingHorizontalMinName: 'बिलकुल किनारे पर ताक़त',
    settingHorizontalMinDesc: 'जब कर्सर खिड़की के किनारे से सटा हो तब लहर कितनी तेज़ हो, पूरी ताक़त के प्रतिशत में। मान जितना कम, पाठ की ओर बढ़ने तक पंक्ति उतनी ही संयमित लगती है।',
    settingCapsModeName: 'छोर के निशान',
    settingCapsModeDesc: 'नोट की शुरुआत और अंत की दो छोटी पट्टियाँ।',
    optCapsOn: 'दिखें और दबाई जा सकें',
    optCapsQuiet: 'दिखें, पर दबाई न जा सकें',
    optCapsOff: 'पूरी तरह हटा दें',
    optCurveCustom: 'अपना बनाया आकार, पिक्सेल में',
    settingCenterModeName: 'लहर का केंद्र कहाँ बैठे',
    settingCenterModeDesc: 'पट्टी पर — दो पट्टियों के बीच की खाली जगह ठीक बीच से बँट जाती है। जब तक कर्सर एक पट्टी के ऊपर है, कुछ भी नहीं हिलता। आधे से आगे बढ़ते ही लहर अगली पट्टी पर सरक जाती है, उतनी ही कोमलता से जितनी वह कर्सर के पीछे चलती। स्वतंत्र — केंद्र ठीक कर्सर के नीचे रहता है, इसलिए जिन दो पट्टियों के बीच वह है वे लहर बाँट लेती हैं और हर छोटी हलचल पर दोनों हिलती हैं।',
    optCenterSnap: 'पट्टी पर',
    optCenterFree: 'स्वतंत्र, कर्सर के नीचे',
    settingRailEdgeName: 'खिड़की के किनारे से दूरी',
    settingRailEdgeDesc: 'पूरी पंक्ति नोट के किनारे से कितनी हटाई जाए, पिक्सेल में।',
    settingColGapName: 'स्तंभों के बीच अंतर',
    settingColGapDesc: 'जिन नोटों के लिए एक स्तंभ कम पड़ता है, उनमें पट्टी-स्तंभों के बीच की जगह, पिक्सेल में।',
    settingLevelThickName: (n) => 'स्तर ' + n + ' — मोटाई',
    settingLevelFadeName: (n) => 'स्तर ' + n + ' — अपारदर्शिता',
    settingGlowLiftName: 'चमक पट्टियों को आगे लाती है',
    settingGlowLiftDesc: 'चमक पट्टी को पूरी अपारदर्शिता की ओर कितना खींचे, प्रतिशत में। इसके बिना चमक कुल अपारदर्शिता से गुणा होकर लगभग गायब हो जाती थी, और लगता था कि केवल वर्तमान पट्टी ही जलती है।',
    settingGlowColorName: 'चमक का रंग',
    settingGlowColorDesc: 'वर्तमान स्थान की चमक का रंग। डिफ़ॉल्ट रूप से वर्तमान शीर्षक का रंग।',
    settingsSectionPresets: 'बने-बनाए रूप',
    presetsHint: 'एक रूप मानों का समूह है जो एक साथ लागू होता है। कोई चुनिए, लागू कीजिए और वहीं से आगे बदलते रहिए — कुछ भी बँधा हुआ नहीं है। दूसरों के भेजे रूप लेखक की जाँच के बाद यहीं जुड़ते हैं।',
    settingPresetName: 'रूप',
    settingPresetDesc: 'यह उसी प्रोफ़ाइल पर लागू होता है जिसे आप अभी बदल रहे हैं। जो रूप में नहीं है वह वैसा ही रहेगा जैसा आपने रखा था।',
    presetApply: 'लागू करें',
    presetApplied: (name) => 'रूप लागू हुआ: ' + name,
    settingShareName: 'अपना रूप भेजें',
    settingShareDesc: 'यदि आपको पसंद आने वाला कुछ बन गया हो, तो भेज सकते हैं। जाँचे हुए रूप किसी अगले संस्करण में सूची में जुड़ जाते हैं।',
    shareOpen: 'भेजें…',
    shareTitle: 'अपना रूप भेजें',
    shareIntro: 'नीचे वही मान हैं जिन्हें आप अभी इस्तेमाल कर रहे हैं। इन्हें कॉपी कीजिए और ईमेल से भेज दीजिए। अपने आप कहीं कुछ नहीं जाता — प्लगइन बस तैयार चिट्ठी के साथ आपका मेल ऐप खोलता है।',
    shareCopy: 'सेटिंग्स कॉपी करें',
    shareCopied: 'सेटिंग्स क्लिपबोर्ड पर कॉपी हो गईं',
    shareCopyManual: 'चुने हुए पाठ को हाथ से कॉपी कीजिए',
    shareMail: 'ईमेल खोलें',
    shareSubject: 'Heading Rail — देखने के लिए एक रूप',
    shareBody: 'कॉपी की हुई सेटिंग्स इस पंक्ति के नीचे चिपकाइए, और यदि कोई नाम सोचा हो तो रूप का नाम भी लिख दीजिए।\n\n',
    shareNote: 'इसमें केवल प्लगइन की सेटिंग्स के मान जाते हैं। नोट का पाठ, फ़ाइलों के नाम या आपके संग्रह की कोई और चीज़ इसमें शामिल नहीं होती।',
    contactLine: 'इस प्लगइन या किसी और के लिए कोई विचार हो तो लेखक को लिखिए:',
    settingPreviewTitleColorName: 'शीर्षक का रंग',
    settingPreviewTextColorName: 'पाठ का रंग',
    settingsSectionPanelLook: 'रूपरेखा के रंग',
    settingPanelBgName: 'रूपरेखा की पृष्ठभूमि',
    settingPanelTextName: 'रूपरेखा का पाठ',
    settingPanelActiveTextName: 'वर्तमान प्रविष्टि',
    presetBase: 'Base',
    glowHint: 'दो अलग चीज़ें, दोनों अलग-अलग चालू होती हैं: एक वर्तमान पट्टी, दूसरी उसके चारों ओर का आभामंडल। आभामंडल वैसे ही तय होता है जैसे पट्टियों की लंबाई — वह कितनी पट्टियों तक पहुँचे और हर सीढ़ी कितनी चमकीली हो, ऊपर और नीचे एक जैसी।',
    settingActiveGlowName: 'वर्तमान पट्टी को उजागर करें',
    settingActiveGlowDesc: 'उस शीर्षक की पट्टी जिसमें आप इस समय हैं।',
    optGlowAlways: 'हमेशा',
    optGlowHover: 'केवल जब पंक्ति की ओर इशारा हो',
    optGlowTouch: 'केवल जब तक उँगली पंक्ति पर है',
    settingHaloModeName: 'उसके चारों ओर आभामंडल',
    settingHaloModeDesc: 'वर्तमान पट्टी के पड़ोसी, जो दूर जाते-जाते फीके पड़ते हैं।',
    settingHaloSpanName: 'आभामंडल में पट्टियाँ',
    settingHaloSpanDesc: (span, side) => 'हमेशा विषम: वर्तमान पट्टी और हर ओर ' + side + '। अभी ' + span + '।',
    settingsSectionHaloSteps: 'हर सीढ़ी की चमक',
    haloStepsHint: 'वर्तमान पट्टी से हर दूरी पर पट्टी कितनी चमकीली हो, प्रतिशत में। पहली सीढ़ी उसकी ठीक पड़ोसी है, और वही मान ऊपर तथा नीचे दोनों ओर लगते हैं।',
    settingHaloStepName: (d) => 'सीढ़ी ' + d,
    colourHint: 'हर रंग अपनी अपारदर्शिता के साथ एक ही पंक्ति में है, और दाहिनी ओर का तीर उस रंग को आपकी थीम को लौटा देता है।',
    settingCapThickName: 'छोर के निशान — मोटाई',
    settingCapOpacityName: 'छोर के निशान — अपारदर्शिता',
    settingPanelGapName: 'पट्टियों से दूरी',
    settingPanelGapDesc: 'पंक्ति और रूपरेखा की सूची के बीच की दूरी, पिक्सेल में।',
    settingsSectionPreviewLook: 'झलक के रंग',
    settingMobileOnName: 'इस फ़ोन पर प्लगइन चलाएँ',
    settingMobileOnDesc: 'Obsidian का अपना स्वाइप इशारा स्क्रीन के किनारे के पास रहता है, और वह पंक्ति के बीच आ जाता है। यदि इस वजह से फ़ोन पर फ़ायदे से ज़्यादा झंझट हो, तो यहीं से प्लगइन बंद कर दीजिए — कंप्यूटर पर सब पहले जैसा चलता रहेगा।',
    mobileOffHint: 'फ़ोन पर पंक्ति बंद है। बाकी फ़ोन सेटिंग्स छिपा दी गई हैं, क्योंकि यहाँ उनका कोई असर नहीं होता।',
    settingFollowThemeName: 'थीम के साथ चलें',
    settingFollowThemeDesc: 'बने-बनाए रूप से आए रंग ऐसे सँवारे जाते हैं कि कभी उजले पर उजला या गहरे पर गहरा न पड़े: रूप के लेखक ने उन्हें अपनी थीम के लिए चुना था, आपकी के लिए नहीं। जो रंग आप ख़ुद चुनते हैं, उन्हें कभी नहीं छुआ जाता — भले ही वे पृष्ठभूमि के क़रीब हों।',
    settingRadiusName: 'कोनों की गोलाई',
    settingRadiusDesc: 'प्लगइन जो कुछ बनाता है उस सब के लिए एक ही मान: झलक का कार्ड, रूपरेखा की सूची और खोज का ख़ाना।',
    settingActiveMoveName: 'जब वर्तमान पट्टी बदले',
    settingActiveMoveDesc: 'छलाँग — चमक नई जगह पर तुरंत आ जाती है। यात्रा — वह वहाँ तक जाती है और पीछे फीकी पड़ती लकीर छोड़ती है। रूपरेखा पर क्लिक करने पर चमक इसीलिए अचानक लगती है कि वह आधी पंक्ति एक ही बार में लाँघ जाती है।',
    optMoveTravel: 'नई जगह तक जाती है',
    optMoveInstant: 'सीधे छलाँग लगाती है',
    settingTravelTimeName: 'यात्रा का समय',
    settingTravelTimeDesc: 'चमक को वहाँ पहुँचने में कितना समय लगे, मिलीसेकंड में।',
    settingTravelOvershootName: 'पहुँचते समय आगे निकलना',
    settingTravelOvershootDesc: 'वह ठिकाने से कितना आगे निकलकर टिकती है।',
    settingTravelTrailName: 'रास्ते की लकीर',
    settingTravelTrailDesc: 'रास्ते में पड़ने वाली पट्टियाँ कितनी चमकती हैं। शून्य पर बिना लकीर के सीधी यात्रा।',
    shareNameName: 'रूप का नाम',
    shareNameDesc: 'वैकल्पिक। यह चिट्ठी में चला जाता है, ताकि रूप को कोई नाम मिल सके।',
    shareNamePlaceholder: 'जैसे: Night Ruler',
    shareWhichName: 'क्या भेजना है',
    shareWhichDesc: 'चिट्ठी में हर समूह पर नाम लिखा होता है, इसलिए कंप्यूटर और फ़ोन कभी नहीं गड्डमड्ड होते।',
    shareBoth: 'दोनों — कंप्यूटर और फ़ोन',
    presetStateOn: (name) => 'अभी चालू है: ' + name + '।',
    presetStateChanged: (name) => 'अभी चालू है: ' + name + ', उस पर आपके अपने बदलाव।',
    presetRestore: 'रूप पर लौटें',
    settingScrollToName: 'शीर्षक कहाँ आकर रुके',
    settingScrollToDesc: 'जब आप पंक्ति या रूपरेखा से किसी शीर्षक पर जाएँ, तो वह स्क्रीन पर कहाँ आकर बैठे।',
    optScrollTop: 'सबसे ऊपर',
    optScrollUpper: 'ऊँचाई के एक तिहाई पर',
    optScrollCenter: 'बीचोंबीच',
    contributeLine: 'कोई ऐसा फ़ोर्क बनाया है जो सच में बेहतर है? उसका सोर्स और आपने उसे कैसे बनाया, मुझे भेजिए। अगर वह वाक़ई बेहतर है, तो मैं उसे अगले संस्करण में शामिल करूँगा और आपको सह-लेखक के रूप में दर्ज करूँगा। आपके कोड में बदलाव करने का अधिकार मेरे पास रहेगा, पर अगर वह आधार बना, तो आपका नाम ज़रूर रहेगा।',
  },
};

// Язык интерфейса Obsidian, если доступен, иначе английский.
// Пока заполнен только en — при отсутствии перевода всегда используется он.
// Язык берётся из настроек плагина; 'auto' — из настроек самого Obsidian.
// На телефоне значение Obsidian не всегда доступно, поэтому и нужен явный выбор.
let CURRENT_LOCALE = 'en';

const LANGUAGE_NAMES = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  hi: 'हिन्दी',
};

function detectLocale() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const v = window.localStorage.getItem('language');
      if (v && LOCALES[v]) return v;
    }
  } catch (e) { /* хранилище недоступно */ }
  try {
    const nav = (typeof navigator !== 'undefined' && navigator.language) || '';
    const short = nav.slice(0, 2).toLowerCase();
    if (LOCALES[short]) return short;
  } catch (e) { /* язык системы недоступен */ }
  return 'en';
}

function setLocale(choice) {
  CURRENT_LOCALE = (choice && choice !== 'auto' && LOCALES[choice])
    ? choice
    : detectLocale();
}

function t(key, ...args) {
  const table = LOCALES[CURRENT_LOCALE] || LOCALES.en;
  const val = key in table ? table[key] : LOCALES.en[key];
  if (val === undefined) {
    // иначе отсутствующая строка молча рисуется пустотой, и поломку не видно
    console.warn('[Heading Rail] missing string:', key);
    return key;
  }
  return typeof val === 'function' ? val(...args) : val;
}


/* ---------- Настройки внешнего вида (можно править прямо здесь) ---------- */

const BASE_W = { 1: 36, 2: 27, 3: 20, 4: 15, 5: 11, 6: 9 };  // запасные длины, если настройка пуста
const CAP_W = 10;         // базовая ширина торцевых полосок (верх/низ документа)

const ROW_H_MAX = 15;
const ROW_H_MIN = 7;
const HOVER_W = 56;
const MOBILE_HOVER_W = 36;   // на узком экране зона уже
const MOBILE_PAD_TOP = 14;   // отступ сверху на телефоне
const MOBILE_PAD_BOTTOM = 72; // отступ снизу: под панелью действий мобильного Obsidian
const MOBILE_DEPTH_MIN = 0.38; // отклик уже при касании у самого края, без ведения
const LONG_PRESS_MS = 450;   // удержание вместо правой кнопки
const TOUCH_SLOP = 10;       // сдвиг пальца, после которого это уже протяжка, а не удержание
const RAIL_WHEEL_BOOST = 3.2;  // во сколько раз колесо/жест над рельсом быстрее обычной прокрутки
const COL_GAP = 10;       // зазор между столбцами полосок
const RAIL_PAD_TOP = 26;   // отступ рельса сверху: с запасом под верхний указатель структуры (12px зазор + его высота)
const RAIL_PAD_BOTTOM = 34; // отступ снизу: под строкой состояния со счётчиком слов
const PANEL_W = 250;      // ширина раскрытой структуры
const SEARCH_H = 30;      // высота строки поиска
const SEARCH_GAP = 26;    // зазор между поиском и структурой (в нём живёт указатель)
const FALLBACK_PEAK = 62;   // запасная длина на пике, если настройка пуста

/* Кривые волны. Каждая получает u — расстояние до центра волны, выраженное
   в долях захвата (0 в центре, 1 на границе захвата), — и возвращает силу
   от 0 до 1. edge подстраивает резкость краёв: больше — уже и резче.
   Набор открыт: добавить новую форму = добавить сюда строчку и вариант
   в выпадающий список настроек. */
const WAVE_CURVES = {
  // мягкий колокол — спокойная волна без явных границ
  bell: (u, e) => Math.exp(-Math.pow(u, 2 * e)),
  // острый пик — сила падает сразу от центра
  peak: (u, e) => Math.exp(-u * e * 1.6),
  // плато — широкая ровная вершина с быстрым спадом по краям
  plateau: (u, e) => Math.exp(-Math.pow(u, 5 * e)),
  // косинус — ровная дуга, ровно на границе захвата обращается в ноль
  cosine: (u) => (u >= 1 ? 0 : (1 + Math.cos(Math.PI * u)) / 2),
  // клин — прямой спад, самая простая и предсказуемая форма
  wedge: (u) => Math.max(0, 1 - u),
  // ступень — внутри захвата все полоски одинаково длинные, снаружи обычные
  step: (u) => (u <= 1 ? 1 : 0),
  // рябь — за основной волной идёт вторая, послабее
  ripple: (u, e) => {
    const v = Math.exp(-Math.pow(u, 2 * e) * 0.55) * Math.cos(u * 2.4);
    return Math.max(0, v);
  },
};

/* Почта автора. Показывается внизу настроек и подставляется в письмо, когда
   человек решает поделиться своим набором. Ничего никуда не уходит само:
   плагин лишь открывает почтовый клиент с уже заполненным письмом, которое
   человек отправляет сам — или не отправляет. */
const AUTHOR_EMAIL = 'lavrowws@gmail.com';
const HR_VERSION = '8.3.0';

/* Готовые наборы настроек.

   Каждый набор — просто список значений, которые накладываются поверх
   текущего профиля; всё, чего в наборе нет, остаётся как было. Наборы от
   других людей добавляются сюда же: человек присылает свой набор письмом,
   автор проверяет и вносит его в этот список к следующему выпуску. */
const STYLE_PRESETS = [
  {
    id: 'base',
    name: 'presetBase',
    author: 'DAST',
    // Base — набор автора. Пустой список означает «значения по умолчанию»:
    // они и есть Base. Наборы от других людей добавляются сюда же — человек
    // присылает свой письмом, автор проверяет и вносит к следующему выпуску.
    settings: null,
  },
];

// Настройки-цвета. Нужны, чтобы отличать цвет, пришедший из набора, от
// цвета, который человек выставил сам: подстраивается только первый.
const COLOR_KEYS = ['barColor', 'activeColor', 'waveColor', 'glowColor', 'gradientFrom', 'gradientTo', 'panelBg', 'panelText', 'panelActiveText', 'previewBg', 'previewTitleColor', 'previewTextColor'];

/* Шрифты для подсказки. Три верхних — те самые, что настроены в самом
   Obsidian: интерфейсный, текстовый и моноширинный, поэтому подсказка может
   совпадать со шрифтом заметки без отдельной настройки. Ниже — обычные
   семейства на случай, если хочется чего-то своего. */
const FONT_STACKS = {
  interface: 'var(--font-interface)',
  text: 'var(--font-text)',
  mono: 'var(--font-monospace)',
  system: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  sans: 'Inter, "Helvetica Neue", Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  slab: '"Roboto Slab", "Bookman Old Style", Georgia, serif',
  monospace: '"JetBrains Mono", "SF Mono", Consolas, monospace',
};

/* Подстройка заданного цвета под тему.

   Тема в Obsidian может быть какой угодно, и цвет, выбранный в тёмной, в
   светлой оказывается белым по белому. Здесь цвет разбирается на тон,
   насыщенность и светлоту, и если светлота идёт вразрез с темой, она
   переворачивается: тон и насыщенность остаются те же, а цвет перестаёт
   сливаться с фоном. Тон не трогаем — иначе сиреневый стал бы зелёным. */
function adaptToTheme(hex, isLight) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return hex;
  let h = m[1];
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hue = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === r) hue = ((g - b) / d) % 6;
    else if (max === g) hue = (b - r) / d + 2;
    else hue = (r - g) / d + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }

  // светлое на светлом и тёмное на тёмном — переворачиваем светлоту
  const wrong = isLight ? l > 0.5 : l < 0.5;
  if (!wrong) return '#' + h;
  const nl = 1 - l;

  const c = (1 - Math.abs(2 * nl - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const mm = nl - c / 2;
  let rr, gg, bb;
  if (hue < 60) [rr, gg, bb] = [c, x, 0];
  else if (hue < 120) [rr, gg, bb] = [x, c, 0];
  else if (hue < 180) [rr, gg, bb] = [0, c, x];
  else if (hue < 240) [rr, gg, bb] = [0, x, c];
  else if (hue < 300) [rr, gg, bb] = [x, 0, c];
  else [rr, gg, bb] = [c, 0, x];
  const to = (v) => Math.round((v + mm) * 255).toString(16).padStart(2, '0');
  return '#' + to(rr) + to(gg) + to(bb);
}

// Плавное начало и плавный конец при равномерном ходе времени
function smoothStep(x) {
  const u = x <= 0 ? 0 : x >= 1 ? 1 : x;
  return u * u * (3 - 2 * u);
}

// Число из настройки, с запасным значением: пустая строка, undefined и
// испорченные данные не должны превращаться в NaN и гасить всю волну.
function numOr(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// Сила волны для расстояния dist (px) при захвате reach (px)
function waveStrength(curve, dist, reach, edge) {
  const fn = WAVE_CURVES[curve] || WAVE_CURVES.bell;
  const u = Math.abs(dist) / Math.max(1, reach);
  const e = Math.max(0.2, Math.min(4, (Number(edge) || 100) / 100));
  const v = fn(u, e);
  return v > 0 ? Math.min(1, v) : 0;
}

const JUMP_MARGIN = 12;
const CENTER_RATIO = 0.5;
const MARKER_MIN_H = 6;   // минимальная высота бегунка видимой зоны структуры
const GROUP_LEAVE_DELAY = 90;  // мс: пауза перед выводом «мышь ушла с виджета»

const ANIM_MIN = 200;     // мс: минимальная длительность перехода
const ANIM_MAX = 800;     // мс: максимальная длительность перехода
const SETTLE_TRIES = 6;   // сколько раз доводить до точной позиции после анимации
const SETTLE_STEP = 50;   // мс между доводками
const SETTLE_EPS = 2;     // px: допустимая погрешность попадания
const UNDO_DEPTH = 5;       // сколько удалений можно откатить
const SCRUB_MAX_MS = 20000; // предохранитель: протяжка не может длиться дольше
const PANEL_LERP = 0.34;  // скорость подводки списка структуры
const SCRUB_LERP = 0.55;  // 1 = мгновенно; чуть меньше даёт незаметное сглаживание

/* ------------------------------------------------------------------------ */

// Настройки, которые могут отличаться на компьютере и на телефоне.
// Ровно эти ключи составляют «профиль» — их можно настроить раздельно
// либо привязать к компьютерным значениям по одному.
/* Base — набор автора. Это и есть значения по умолчанию: плагин ставится
   сразу с ним, отдельно включать ничего не нужно.

   Все цвета здесь пустые, и это осознанно. Пустой цвет означает «взять у
   темы», а тема может быть какой угодно — от почти белой до чёрной. Жёстко
   заданный цвет рано или поздно совпадёт с фоном и станет невидимым, поэтому
   в наборе по умолчанию их нет ни одного. */
const PROFILE_DEFAULTS = {
  // расположение
  side: 'right',
  anchor: 'center',
  spacingMode: 'adaptive',
  spacingMin: 10,
  spacingMax: 20,
  fixedSpacing: 16,
  railFrom: 0,            // верхний край рельса, % высоты заметки
  railTo: 95,             // нижний край
  railEdge: 10,           // отступ рельса от края окна, px
  colGap: 20,             // промежуток между столбцами, px
  panelGap: 30,           // расстояние от рельса до структуры, px
  uiRadius: 16,           // скругление подсказки, структуры и поиска, px

  // размеры полоски
  barThickness: 3,
  barWidth: 100,
  lvlW1: 30, lvlW2: 20, lvlW3: 15, lvlW4: 12, lvlW5: 10, lvlW6: 8,
  lvlT1: 100, lvlT2: 100, lvlT3: 100, lvlT4: 100, lvlT5: 100, lvlT6: 100,
  lvlO1: 100, lvlO2: 100, lvlO3: 100, lvlO4: 100, lvlO5: 100, lvlO6: 100,

  // торцы
  capsMode: 'on',
  capWidth: 40,
  capThick: 50,
  capOpacity: 25,

  /* Волна. Каждый кадр полоска получает одно число — силу волны, — и каждое
     свойство внешности идёт по нему от значения в покое к значению на пике. */
  waveIntensity: 150,
  centerMode: 'snap',
  sharpCenter: true,
  waveCurve: 'plateau',
  waveEdge: 45,
  waveReach: 1.9,
  waveSpan: 9,
  stepW0: 68, stepW1: 39, stepW2: 18, stepW3: 2, stepW4: 29,
  stepW5: 27, stepW6: 27, stepW7: 27, stepW8: 27, stepW9: 27,
  stepW10: 27, stepW11: 27, stepW12: 27,
  peakMode: 'target',
  peakLength: 36,
  peakAdd: 100,
  waveColor: '',
  restBright: 20,
  peakBright: 90,
  restOpacity: 100,
  peakOpacity: 100,
  peakThick: 100,
  followTime: 350,
  overshoot: 65,
  riseTime: 310,
  fallTime: 320,
  reactZone: 110,
  horizontalDepth: false,
  horizontalRange: 500,
  horizontalMin: 100,
  wavePinned: true,
  wavePeek: true,

  // подсветка положения
  activeGlow: 'always',
  activeOpacity: 70,
  activeMove: 'travel',   // 'instant' — выделение перескакивает, 'travel' — переезжает
  activeTravelTime: 510,  // за сколько переезжает, мс
  activeOvershoot: 50,    // проскок при переезде, %
  activeTrail: 100,       // насколько светится след по пути, %
  haloMode: 'always',
  haloSpan: 15,
  haloS0: 70, haloS1: 45, haloS2: 26, haloS3: 14, haloS4: 8,
  haloS5: 5, haloS6: 3, haloS7: 2, haloS8: 1, haloS9: 1,
  haloS10: 1, haloS11: 1, haloS12: 1,
  glowColor: '',
  glowLift: 100,

  // цвет
  barColor: '',
  activeColor: '',
  barOpacity: 15,
  useGradient: false,
  gradientFrom: '#8b7cff',
  gradientTo: '#4ec5ff',
  panelBg: '',
  panelText: '',
  panelActiveText: '',

  // поведение
  hoverScrolls: false,
  scrollTo: 'top',        // куда встаёт заголовок при переходе: 'top' | 'upper' | 'center'

  // подсказка при наведении
  hoverPreview: true,
  previewTrigger: 'bars',
  previewPlacement: 'auto',
  previewChars: 260,
  previewGap: 40,
  previewWidth: 410,
  previewBg: '',
  previewTitleSize: 20,
  previewTitleWeight: 700,
  previewTitleFont: 'sans',
  previewTitleColor: '',
  previewTextSize: 12,
  previewTextWeight: 400,
  previewTextFont: 'text',
  previewTextColor: '',
  previewLineHeight: 145,
};

const DEFAULT_SETTINGS = {
  mobileEnabled: true,    // плагин работает на телефоне
  activePreset: 'base',   // какой набор сейчас стоит
  followTheme: true,      // подстраивать заданные цвета под светлую и тёмную тему
  // общие, не зависят от устройства
  language: 'auto',      // 'auto' — язык интерфейса Obsidian, иначе код языка
  showSearch: true,
  searchAtBottom: false,
  trashMax: 20,

  // раздельные профили
  desktop: Object.assign({}, PROFILE_DEFAULTS),
  mobile: Object.assign({}, PROFILE_DEFAULTS, {
    /* Base для телефона — отдельный набор автора, не пересчёт компьютерного.
       Палец не курсор: волна шире и мягче, полоски крупнее, заголовок при
       переходе встаёт не под самую кромку экрана, а повыше от неё. */
    spacingMin: 10,
    spacingMax: 16,
    fixedSpacing: 36,
    railFrom: 10,
    railTo: 90,
    railEdge: 6,
    panelGap: 20,
    uiRadius: 20,
    lvlW1: 36, lvlW2: 27, lvlW3: 20, lvlW4: 15, lvlW5: 11, lvlW6: 9,
    capWidth: 10,
    capThick: 100,
    capOpacity: 75,
    waveReach: 2,
    peakLength: 50,
    peakAdd: 202,
    stepW1: 63, stepW2: 49, stepW3: 36,
    followTime: 150,
    overshoot: 40,
    riseTime: 180,
    fallTime: 260,
    reactZone: 0,           // подходить курсором нечем
    horizontalRange: 200,
    horizontalMin: 25,
    wavePeek: false,        // удерживать Ctrl на телефоне нечем
    activeOpacity: 100,
    barOpacity: 100,
    scrollTo: 'upper',
    previewGap: 50,
    previewWidth: 300,
    previewTitleSize: 14,
    previewTitleWeight: 600,
    previewTitleFont: 'interface',
    previewTextSize: 13,
    previewTextFont: 'interface',
  }),  // какие настройки телефона взяты с компьютера (по одной)
  mobileLinked: {},
};

class HeadingRailPlugin extends Plugin {
  async onload() {
    this.loadId = 'hr' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    this.settings = this.migrateSettings(await this.loadData());
    setLocale(this.settings.language);
    this.addSettingTab(new HeadingRailSettingTab(this.app, this));
    this.isOpen = false;
    this.ctrlTemp = false;
    this.overRail = false;
    this.headings = [];
    this.stops = [];          // торцы + полоски заголовков единым списком
    this.panelItems = [];
    this.hostEl = null;
    this.railEl = null;
    this.sideEl = null;
    this.panelEl = null;
    if (this.panelRaf) { cancelAnimationFrame(this.panelRaf); this.panelRaf = null; }
    this.panelTarget = null;
    this.markerEls = null;
    this.previewEl = null;
    this.itemTop = null;
    this.itemH = null;
    this.panelTarget = null;
    if (this.panelRaf) { cancelAnimationFrame(this.panelRaf); this.panelRaf = null; }
    this.menuEl = null;
    this.menuIdx = null;
    this.colEls = [];
    this.centers = null;
    this.filterActive = false;
    this.searchInput = null;
    this.panelListEl = null;
    this.markerEl = null;
    this.edgeTop = null;
    this.edgeBottom = null;
    this.pendingCenterIdx = null;
    this.currentFile = null;
    this.currentMode = null;
    this.scrollTarget = null;
    this.rowH = ROW_H_MAX;
    this.activeIndex = 0;
    this.lastSyncedIdx = -1;
    this.pinnedIdx = null;
    this.railHovered = false;
    this.panelHovered = false;
    this.leaveTimer = null;
    this.animId = null;
    this.settleTimer = null;
    this.dragging = false;
    this.spaceHeld = false;
    this.scrubTarget = null;
    this.scrubRaf = null;
    this.rafScroll = false;
    this.rafWave = false;
    this.rafMarker = false;
    this.pendingPointer = null;
    this.actionViews = new WeakSet();
    this.selected = new Set();
    this.anchorIdx = null;
    this.undoStack = [];
    this.copyStack = [];
    this.holdOpen = false;
    this.isMobile = this.detectMobile();
    this.kbOpen = false;

    this.onScroll = this.onScroll.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onDocMouseMove = this.onDocMouseMove.bind(this);
    this.onDocMouseUp = this.onDocMouseUp.bind(this);

    this.registerDomEvent(document, 'keydown', this.onKeyDown);
    this.registerDomEvent(document, 'keyup', this.onKeyUp);
    this.registerDomEvent(document, 'mousemove', this.onDocMouseMove);
    this.registerDomEvent(document, 'mouseup', this.onDocMouseUp);
    this.registerDomEvent(window, 'blur', () => {
      this.setCtrlTemp(false);
      this.spaceHeld = false;
      this.holdOpen = false;
      this.endScrub();
    });
    this.registerDomEvent(document, 'visibilitychange', () => {
      if (document.hidden) { this.spaceHeld = false; this.endScrub(); }
    });
    this.registerDomEvent(document, 'mouseleave', () => {
      if (this.dragging) this.endScrub();
    });

    this.registerEvent(this.app.workspace.on('active-leaf-change', () => this.refresh()));
    this.registerEvent(this.app.workspace.on('file-open', () => this.refresh()));
    this.registerEvent(this.app.workspace.on('layout-change', () => this.refresh()));
    // Сменилась тема или её настройки — заданные цвета надо пересчитать под неё
    this.registerEvent(this.app.workspace.on('css-change', () => this.refresh(true)));
    this.registerEvent(
      this.app.metadataCache.on('changed', (file) => {
        if (!this.currentFile || file.path !== this.currentFile.path) return;
        // с запасом по времени: пока идёт набор текста, перестраивать нечего
        if (this.metaTimer) clearTimeout(this.metaTimer);
        this.metaTimer = window.setTimeout(() => {
          this.metaTimer = null;
          this.refresh();
        }, 300);
      })
    );

    this.addCommand({
      id: 'delete-selected-sections',
      name: t('cmdDeleteSelected'),
      callback: () => this.deleteSelected(),
    });
    this.addCommand({
      id: 'copy-selected-sections',
      name: t('cmdCopySelected'),
      callback: () => this.copySelected(),
    });
    this.addCommand({
      id: 'restore-last-deletion',
      name: t('cmdRestoreLast'),
      callback: () => this.restoreLast(),
    });

    if (this.isMobile) this.registerMobileGlobals();

    this.app.workspace.onLayoutReady(() => this.refresh());
  }

  onunload() {
    // свои кнопки уносим с собой, иначе останутся мёртвыми в шапке заметки
    try {
      document.querySelectorAll('.hr-action-btn[data-hr-load="' + this.loadId + '"]')
        .forEach((b) => b.remove());
    } catch (e) { /* нечего убирать */ }
    this.cancelAnim();
    this.endScrub();
    this.teardown();
    if (this.leaveTimer) clearTimeout(this.leaveTimer);
    if (this.metaTimer) clearTimeout(this.metaTimer);
    if (this.fallbackStyleEl) this.fallbackStyleEl.remove();
  }

  /* --------------------------- настройки --------------------------- */

  // Старые версии хранили все настройки плоским списком. Переносим их
  // в профиль компьютера, чтобы уже настроенное не сбросилось при обновлении.
  migrateSettings(raw) {
    const data = raw || {};
    const out = {
      language: data.language || 'auto',
      showSearch: data.showSearch !== undefined ? data.showSearch : true,
      searchAtBottom: !!data.searchAtBottom,
      trashMax: data.trashMax || 20,
      // Base включён с установки, отдельно применять его не нужно
      activePreset: data.activePreset || 'base',
      themedColors: data.themedColors || { desktop: {}, mobile: {} },
      mobileEnabled: data.mobileEnabled !== undefined ? data.mobileEnabled : true,
      followTheme: data.followTheme !== undefined ? data.followTheme : true,
      desktop: Object.assign({}, PROFILE_DEFAULTS, data.desktop || {}),
      mobile: Object.assign({}, DEFAULT_SETTINGS.mobile, data.mobile || {}),
      mobileLinked: data.mobileLinked || {},
    };

    if (!data.desktop) {
      for (const key of Object.keys(PROFILE_DEFAULTS)) {
        if (data[key] !== undefined) out.desktop[key] = data[key];
      }
      // прежнее имя настройки подсказки
      if (data.previewWhenOpen !== undefined) {
        out.desktop.previewTrigger = data.previewWhenOpen === 'off' ? 'bars' : 'both';
      }
      if (data.waveSpread !== undefined) out.desktop.waveReach = data.waveSpread;
    }

    // Волна версии 6.0.0 описывалась другим набором чисел. Переносим их,
    // чтобы после обновления рельс выглядел так же, как выглядел.
    for (const prof of [out.desktop, out.mobile]) this.migrateWave(prof);
    return out;
  }

  // Старые ключи волны → новые. Вызывается один раз при загрузке настроек.
  migrateWave(prof) {
    if (prof.waveExtra !== undefined) {
      // раньше длина всегда была прибавкой к своей, общей длины не было
      prof.peakMode = 'add';
      prof.peakAdd = Number(prof.waveExtra) || 48;
      delete prof.waveExtra;
    }
    if (prof.waveShape !== undefined) {
      const sh = Number(prof.waveShape) || 2;
      prof.waveCurve = sh <= 1.2 ? 'peak' : sh >= 3.5 ? 'plateau' : 'bell';
      // прежняя степень спада пересчитывается в резкость краёв новой кривой
      prof.waveEdge = Math.round(Math.max(20, Math.min(400, (sh / 2) * 100)));
      delete prof.waveShape;
    }
    if (prof.waveSpeed !== undefined) {
      prof.followTime = Number(prof.waveSpeed) || 70;
      delete prof.waveSpeed;
    }
    if (prof.waveDecay !== undefined) {
      prof.fallTime = Number(prof.waveDecay) || 260;
      delete prof.waveDecay;
    }
    if (prof.inertia !== undefined) {
      prof.overshoot = Number(prof.inertia) || 0;
      delete prof.inertia;
    }
    delete prof.inertiaDamping;
  }

  // Действующий набор настроек: профиль устройства, а привязанные ключи —
  // из компьютерного профиля.
  // Плагин на телефоне можно выключить целиком: из-за встроенного жеста у
  // края экрана рельс там подходит не всем, а на компьютере он при этом
  // должен продолжать работать.
  get disabledHere() {
    return this.isMobile && this.settings && this.settings.mobileEnabled === false;
  }

  get p() {
    const desk = this.settings.desktop;
    if (!this.isMobile) return desk;

    const own = this.settings.mobile;
    const linked = this.settings.mobileLinked || {};
    const out = {};
    for (const key of Object.keys(PROFILE_DEFAULTS)) {
      out[key] = linked[key] ? desk[key] : own[key];
    }
    return out;
  }

  /* --------------------- удаление разделов и откат --------------------- */

  // Сравнивать файлы дословно нельзя: Obsidian может поменять концы строк
  // или хвостовой перенос, и восстановление отказывало бы без причины
  normText(t) {
    return String(t).replace(/\r\n/g, '\n').replace(/\n+$/, '\n');
  }

  // Короткий отпечаток вместо копии файла целиком
  checksum(t) {
    const s2 = this.normText(t);
    let hash = 5381;
    for (let i = 0; i < s2.length; i++) hash = ((hash * 33) ^ s2.charCodeAt(i)) >>> 0;
    return hash + ':' + s2.length;
  }

  // Границы раздела: заголовок и всё под ним до следующего заголовка
  // того же или более высокого уровня. Вложенные подразделы входят внутрь.
  sectionRange(i, totalLines) {
    const level = this.headings[i].level;
    const from = this.headings[i].position.start.line;
    let to = totalLines - 1;
    for (let j = i + 1; j < this.headings.length; j++) {
      if (this.headings[j].level <= level) {
        to = this.headings[j].position.start.line - 1;
        break;
      }
    }
    return { from, to: Math.max(from, to) };
  }

  // Сколько вложенных подразделов попадёт под удаление вместе с выбранным
  nestedCount(i) {
    const level = this.headings[i].level;
    let n = 0;
    for (let j = i + 1; j < this.headings.length; j++) {
      if (this.headings[j].level <= level) break;
      n++;
    }
    return n;
  }

  // Объединяем выбранное: родитель может поглощать своих детей
  mergedRanges(totalLines) {
    const list = Array.from(this.selected)
      .sort((a, b) => a - b)
      .map((i) => this.sectionRange(i, totalLines));

    const out = [];
    for (const r of list) {
      const last = out[out.length - 1];
      if (last && r.from <= last.to + 1) last.to = Math.max(last.to, r.to);
      else out.push({ from: r.from, to: r.to });
    }
    return out;
  }

  // Положения заголовков берутся из разбора файла и могли устареть, если текст
  // правили после отрисовки. Работать по устаревшим номерам строк означало бы
  // тронуть чужой текст — поэтому сверяем перед любой операцией.
  linesMatchHeadings(lines) {
    for (const i of this.selected) {
      const h = this.headings[i];
      const line = lines[h.position.start.line];
      if (line === undefined || line.replace(/^#+\s*/, '').trim() !== h.heading.trim()) {
        new Notice(t('noticeStale'));
        this.hideItemMenu();
        this.refresh(true);
        return false;
      }
    }
    return true;
  }

  // Скопировать выбранные разделы целиком в буфер обмена
  async copySelected() {
    if (!this.selected.size || !this.currentFile) return;
    const file = this.currentFile;

    let content;
    try {
      content = await this.app.vault.read(file);
    } catch (e) {
      new Notice(t('noticeReadFail'));
      return;
    }

    const lines = content.split('\n');
    if (!this.linesMatchHeadings(lines)) return;

    const ranges = this.mergedRanges(lines.length);
    const parts = ranges.map((r) => lines.slice(r.from, r.to + 1).join('\n'));
    const text = parts.join('\n');
    const lineCount = ranges.reduce((sum, r) => sum + (r.to - r.from + 1), 0);

    if (!(await this.writeClipboard(text))) {
      new Notice(t('noticeCopyFail'));
      return;
    }

    const titles = Array.from(this.selected).sort((a, b) => a - b)
      .map((i) => this.headings[i].heading);

    this.copyStack.push({
      path: file.path,
      text,
      titles,
      lines: lineCount,
      time: Date.now(),
    });
    this.pruneTrash();

    const copied = this.selected.size;
    new Notice(t('noticeCopied', copied, lineCount));
  }

  // Повторно положить ранее скопированное в буфер
  async copyAgain(index) {
    const entry = this.copyStack[index];
    if (!entry) return false;
    if (await this.writeClipboard(entry.text)) {
      new Notice(t('noticeCopied', entry.titles.length, entry.lines));
      return true;
    }
    new Notice(t('noticeCopyFail'));
    return false;
  }

  // Запись в буфер обмена с запасными путями: браузерный интерфейс может быть
  // недоступен без действия пользователя, поэтому есть отход на средства Electron
  // и, в последнюю очередь, на старый способ через скрытое поле ввода.
  async writeClipboard(text) {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* пробуем следующий способ */ }

    try {
      const electron = require('electron');
      if (electron && electron.clipboard) {
        electron.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* пробуем следующий способ */ }

    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (e) {
      return false;
    }
  }

  async deleteSelected(confirmed) {
    if (!this.selected.size || !this.currentFile) return;
    // подтверждением служит само меню; из палитры команд удаление явное
    if (confirmed !== true && confirmed !== undefined) return;
    const file = this.currentFile;

    let content;
    try {
      content = await this.app.vault.read(file);
    } catch (e) {
      new Notice(t('noticeReadFail'));
      return;
    }

    const lines = content.split('\n');
    if (!this.linesMatchHeadings(lines)) return;

    const ranges = this.mergedRanges(lines.length);
    const lineCount = ranges.reduce((sum, r) => sum + (r.to - r.from + 1), 0);

    // удаляем с конца, чтобы номера строк выше не сдвигались
    const next = lines.slice();
    for (let k = ranges.length - 1; k >= 0; k--) {
      next.splice(ranges[k].from, ranges[k].to - ranges[k].from + 1);
    }
    const after = next.join('\n');

    try {
      await this.writeFile(file, content, after);
    } catch (e) {
      new Notice(t('noticeModifyFail', e && e.message));
      return;
    }

    // Запоминаем только вырезанные куски и отпечаток результата,
    // а не копию всего файла
    const segments = ranges.map((r) => ({
      from: r.from,
      lines: lines.slice(r.from, r.to + 1),
    }));
    const titles = Array.from(this.selected).sort((a, b) => a - b)
      .map((i) => this.headings[i].heading);

    this.undoStack.push({
      path: file.path,
      segments,
      afterSum: this.checksum(after),
      titles,
      lines: lineCount,
      time: Date.now(),
    });
    this.pruneTrash();

    const removedSections = this.selected.size;
    this.selected.clear();
    this.anchorIdx = null;
    this.hideItemMenu();
    new Notice(t('noticeDeleted', removedSections, lineCount));
  }

  // Между чтением и записью человек может успеть напечатать. Обычная запись
  // затёрла бы набранное, поэтому пользуемся атомарным изменением, если оно есть.
  async writeFile(file, expected, next) {
    const vault = this.app.vault;
    if (typeof vault.process === 'function') {
      let clash = false;
      await vault.process(file, (current) => {
        if (this.normText(current) !== this.normText(expected)) { clash = true; return current; }
        return next;
      });
      if (clash) throw new Error(t('errWriteConflict'));
      return;
    }
    // старые версии Obsidian: перепроверяем прямо перед записью
    const current = await vault.read(file);
    if (this.normText(current) !== this.normText(expected)) {
      throw new Error(t('errWriteConflict'));
    }
    await vault.modify(file, next);
  }

  // Чистка истории удалений по количеству. Список живёт только в памяти
  // текущей сессии и в любом случае обнуляется при перезапуске Obsidian —
  // ограничение по дням тут не имело бы смысла и только вводило бы в заблуждение.
  pruneTrash() {
    const cfg = this.settings || DEFAULT_SETTINGS;
    const maxCount = Math.max(1, Number(cfg.trashMax) || UNDO_DEPTH);
    if (this.undoStack.length > maxCount) {
      this.undoStack = this.undoStack.slice(this.undoStack.length - maxCount);
    }
    if (this.copyStack.length > maxCount) {
      this.copyStack = this.copyStack.slice(this.copyStack.length - maxCount);
    }
  }

  async restoreLast() {
    return this.restoreAt(this.undoStack.length - 1);
  }

  async restoreAt(index) {
    const entry = this.undoStack[index];
    if (!entry) { new Notice(t('noticeNothingToRestore')); return false; }
    const file = this.app.vault.getAbstractFileByPath(entry.path);
    if (!file) { new Notice(t('noticeFileNotFound')); return false; }

    let current;
    try {
      current = await this.app.vault.read(file);
    } catch (e) {
      new Notice(t('noticeReadFail2'));
      return false;
    }

    // если после удаления файл успели изменить, возврат затёр бы правки
    if (this.checksum(current) !== entry.afterSum) {
      new Notice(t('noticeChangedAfterDelete'));
      return false;
    }

    // вставляем куски сверху вниз: каждый предыдущий возвращает смещение.
    // Пустой файл при разборе даёт одну мнимую пустую строку — её быть не должно,
    // иначе после возврата в конце появлялся лишний перенос.
    const lines = current === '' ? [] : current.split('\n');
    const ordered = entry.segments.slice().sort((a, b) => a.from - b.from);
    for (const seg of ordered) {
      lines.splice(seg.from, 0, ...seg.lines);
    }
    const before = lines.join('\n');

    try {
      await this.writeFile(file, current, before);
      this.undoStack.splice(index, 1);
      new Notice(t('noticeRestored'));
      return true;
    } catch (e) {
      new Notice(t('noticeRestoreFail', (e && e.message) || ''));
      return false;
    }
  }

  /* ------------------------------ стили ------------------------------ */

  ensureStyles() {
    if (this.stylesChecked) return;
    this.stylesChecked = true;
    try {
      const probe = document.createElement('div');
      probe.className = 'hr-rail';
      probe.style.visibility = 'hidden';
      document.body.appendChild(probe);
      const applied = getComputedStyle(probe).position === 'absolute';
      probe.remove();
      if (applied) return;

      const style = document.createElement('style');
      style.id = 'hr-fallback-styles';
      style.textContent = FALLBACK_CSS;
      document.head.appendChild(style);
      this.fallbackStyleEl = style;
      console.warn(t('consoleFallbackCss'));
    } catch (e) {
      console.error(t('consoleStyleCheckFail'), e);
    }
  }

  /* ------------------------------ жизненный цикл ------------------------------ */

  getView() {
    return this.app.workspace.getActiveViewOfType(MarkdownView);
  }

  teardown() {
    this.detachScroll();
    if (this.hostEl) {
      this.hostEl.classList.remove('hr-host', 'hr-panel-visible', 'hr-no-wave');
    }
    if (this.railEl) this.railEl.remove();
    if (this.sideEl) this.sideEl.remove();
    this.railEl = null;
    this.sideEl = null;
    this.panelEl = null;
    if (this.panelRaf) { cancelAnimationFrame(this.panelRaf); this.panelRaf = null; }
    this.panelTarget = null;
    this.markerEls = null;
    if (this.travel && this.travel.raf) { cancelAnimationFrame(this.travel.raf); }
    this.travel = null;
    /* Окошко подсказки живёт не в рельсе, а прямо в заметке, и при пересборке
       ссылка на него обнулялась, а сам узел оставался в разметке. Если в этот
       момент подсказка была показана, она навсегда зависала поверх всего, и
       спрятать её было уже нечем. Убираем узел, а не только ссылку. */
    if (this.previewEl) { try { this.previewEl.remove(); } catch (e) { /* уже нет */ } }
    this.previewEl = null;
    this.itemTop = null;
    this.itemH = null;
    this.panelTarget = null;
    if (this.panelRaf) { cancelAnimationFrame(this.panelRaf); this.panelRaf = null; }
    this.menuEl = null;
    this.menuIdx = null;
    this.colEls = [];
    this.centers = null;
    this.filterActive = false;
    this.searchInput = null;
    this.panelListEl = null;
    this.markerEl = null;
    this.edgeTop = null;
    this.edgeBottom = null;
    this.hostEl = null;
    this.stops = [];
    this.panelItems = [];
    this.lastSyncedIdx = -1;
  }

  refresh(force) {
    const view = this.getView();
    if (!view || !view.file) {
      this.cancelAnim();
      this.endScrub();
      this.teardown();
      this.currentFile = null;
      this.sig = null;
      return;
    }

    const cache = this.app.metadataCache.getFileCache(view.file);
    const heads = cache && cache.headings ? cache.headings : [];
    const host = view.containerEl.querySelector('.view-content') || view.containerEl;
    const mode = typeof view.getMode === 'function' ? view.getMode() : 'source';

    // Подпись состояния: пока она не изменилась, разметку трогать незачем.
    // Событий раскладки приходит много, поэтому сначала дешёвая проверка
    // «тот же самый список заголовков», и только затем подсчёт контрольной суммы —
    // раньше на каждое событие заново собиралась строка из всех заголовков.
    const geo = view.file.path + '|' + mode + '|' + Math.round((host.clientHeight || 0) / 8);
    let sig;
    if (heads === this.lastHeads && this.lastHeadsSig !== null && this.lastHeadsSig !== undefined) {
      sig = geo + '|' + this.lastHeadsSig;
    } else {
      let hash = 5381;
      for (let i = 0; i < heads.length; i++) {
        hash = ((hash * 33) ^ heads[i].level) >>> 0;
        const t = heads[i].heading;
        for (let k = 0; k < t.length; k++) hash = ((hash * 33) ^ t.charCodeAt(k)) >>> 0;
      }
      this.lastHeads = heads;
      this.lastHeadsSig = hash;
      sig = geo + '|' + hash;
    }

    if (!force && sig === this.sig && this.railEl && this.hostEl) {
      this.updateActive();
      return;
    }

    this.cancelAnim();
    this.endScrub();
    this.teardown();
    if (this.disabledHere) { this.sig = null; return; }

    this.sig = sig;
    this.currentFile = view.file;
    this.ensureAction(view);
    this.headings = heads;
    this.activeApplied = false;
    this.prevActiveEls = null;
    this.selected.clear();
    this.anchorIdx = null;
    if (this.headings.length < 2) return;

    try {
      this.build(view);
      this.attachScroll(view);
      this.applyPanelState();
      this.updateActive();
      this.paintGlow();
    } catch (e) {
      console.error(t('consoleBuildFail'), e);
    }
  }

  ensureAction(view) {
    try {
      // Кнопки от прошлой загрузки плагина остаются в шапке заметки и выглядят
      // как дубликат, который ни на что не отвечает. Убираем чужие.
      view.containerEl.querySelectorAll('.hr-action-btn').forEach((btn) => {
        if (btn.dataset.hrLoad !== this.loadId) btn.remove();
      });

      if (view.containerEl.querySelector('.hr-action-btn[data-hr-load="' + this.loadId + '"]')) {
        this.actionViews.add(view);
        return;
      }

      const el = view.addAction('list', t('tocTooltip'), () => {
        this.isOpen = !this.isOpen;
        this.applyPanelState();
      });
      if (el) {
        el.addClass('hr-action-btn');
        el.dataset.hrLoad = this.loadId;
      }

      const trash = view.addAction('rotate-ccw', t('trashTooltip'), () => {
        new HeadingRailTrashModal(this.app, this).open();
      });
      if (trash) {
        trash.addClass('hr-action-btn');
        trash.addClass('hr-trash-btn');
        trash.dataset.hrLoad = this.loadId;
      }

      this.actionViews.add(view);
    } catch (e) {
      /* без кнопок — остальное работает */
    }
  }

  /* --------------------------------- разметка -------------------------------- */

  build(view) {
    this.ensureStyles();
    // класс мобильного приложения мог появиться уже после запуска плагина
    this.isMobile = this.detectMobile();

    const host = view.containerEl.querySelector('.view-content') || view.containerEl;
    this.hostEl = host;
    host.classList.add('hr-host');
    host.classList.toggle('hr-mobile', this.isMobile);
    host.classList.toggle('hr-left', this.p.side === 'left');
    host.classList.toggle('hr-kb', !!this.kbOpen);
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';

    // ---------- раскладка: один столбец или несколько ----------
    const n = this.headings.length;
    // Верхний и нижний края рельса заданы долей высоты заметки, а не числом
    // пикселей: на разных экранах и при разном масштабе полоски занимают одну
    // и ту же часть высоты. Привязка по высоте (центр/верх/низ) работает
    // именно внутри этой полосы.
    /* Клавиатура. События изменения видимой области приходят не на всех
       сборках, поэтому её открытие видно ещё и по самой заметке: если она
       вдруг стала заметно ниже, чем была, значит внизу что-то выросло. */
    const full = Math.max(200, host.clientHeight || 0);
    if (this.isMobile) {
      this.hostFull = Math.max(this.hostFull || 0, full);
      if (full < this.hostFull - 120) this.kbOpen = true;
      else if (full > this.hostFull - 40) this.kbOpen = false;
      host.classList.toggle('hr-kb', !!this.kbOpen);
    }
    const from = Math.max(0, Math.min(45, numOr(this.p.railFrom, this.isMobile ? 3 : 4)));
    const to = Math.max(55, Math.min(100, numOr(this.p.railTo, this.isMobile ? 88 : 95)));
    const padTop = Math.round((full * from) / 100);
    const padBottom = Math.round((full * (100 - to)) / 100);
    const usable = Math.max(120, full - padTop - padBottom);
    const slotCount = n + 2;                    // заголовки плюс два торца
    // В постоянном режиме интервал задан настройкой и не зависит от числа
    // заголовков; в подстраивающемся — распределяется по доступной высоте.
    const fixed = this.p.spacingMode === 'fixed';
    const minGap = Math.max(2, Number(this.p.spacingMin) || ROW_H_MIN);
    const maxGap = Math.max(minGap, Number(this.p.spacingMax) || ROW_H_MAX);

    let rowH = fixed
      ? Math.max(2, Number(this.p.fixedSpacing) || 9)
      : usable / slotCount;
    let multi = false;
    let perCol = slotCount;

    // В постоянном режиме малый интервал — осознанный выбор, а не признак
    // нехватки места. Раньше он ошибочно включал раскладку в столбцы,
    // и полоски прижимались к верху вместо того, чтобы стоять по центру.
    const needsColumns = fixed
      ? rowH * slotCount > usable
      : rowH < minGap;

    if (needsColumns) {
      // ужимать дальше некуда — раскладываем в несколько столбцов
      multi = true;
      if (!fixed) rowH = minGap;
      perCol = Math.max(3, Math.floor(usable / rowH));
    } else if (!fixed) {
      rowH = Math.min(maxGap, Math.max(minGap, rowH));
    }
    this.rowH = rowH;
    this.multi = multi;

    const colCount = multi ? Math.ceil(slotCount / perCol) : 1;
    this.colCount = colCount;

    const HW = this.isMobile ? MOBILE_HOVER_W : HOVER_W;
    const rail = host.createDiv({ cls: 'hr-rail' });
    rail.style.setProperty('--hr-hover-w', HW + 'px');
    rail.style.top = padTop + 'px';
    rail.style.bottom = padBottom + 'px';
    rail.classList.toggle('hr-anchor-top', this.p.anchor === 'top');
    rail.classList.toggle('hr-anchor-bottom', this.p.anchor === 'bottom');
    // структура центруется по рельсу, а он смещён вверх — компенсируем
    host.style.setProperty('--hr-center-offset', ((padTop - padBottom) / 2) + 'px');
    rail.classList.toggle('hr-multi', multi);
    this.railEl = rail;
    this.stops = [];
    this.colEls = [];

    this.applyLookVars(host);

    const gap = Math.max(0, numOr(this.p.colGap, COL_GAP));
    rail.style.setProperty('--hr-col-gap', gap + 'px');
    rail.style.setProperty('--hr-rail-edge', Math.max(0, numOr(this.p.railEdge, 0)) + 'px');
    const railW = colCount * HW + (colCount - 1) * gap;
    host.style.setProperty('--hr-rail-w', railW + 'px');
    host.style.setProperty('--hr-push', (railW + 8 + PANEL_W + 16) + 'px');

    // На пике полоска бывает длиннее самого рельса и вылезает на текст. Чтобы
    // она при этом не ложилась поверх подсказки, считаем запас и отодвигаем
    // на него окошко подсказки. Структура отодвигается тем же запасом, но
    // только если волна при раскрытой структуре вообще разрешена.
    host.style.setProperty('--hr-wave-room', Math.max(0, this.peakBarWidth() - railW) + 'px');

    // на всякий случай убираем окошки, оставшиеся от прошлых загрузок плагина
    try {
      host.querySelectorAll('.hr-preview').forEach((el) => {
        if (el !== this.previewEl) el.remove();
      });
    } catch (e) { /* не нашлось — и хорошо */ }

    /* Список мест: торец начала, заголовки, торец конца. Торцы можно убрать
       совсем — тогда их нет ни на виду, ни в разметке, ни в переходах
       стрелками, — или оставить видимыми, но неотзывчивыми. */
    const caps = this.p.capsMode || 'on';
    const slots = (caps === 'off' ? [] : [{ kind: 'top' }])
      .concat(this.headings.map((h, i) => ({ kind: 'h', hIdx: i })))
      .concat(caps === 'off' ? [] : [{ kind: 'bottom' }]);

    let colEl = null;
    let inCol = 0;
    let colIdx = -1;

    const newCol = () => {
      colIdx++;
      inCol = 0;
      colEl = rail.createDiv({ cls: 'hr-col' });
      colEl.style.width = HW + 'px';
      this.colEls.push(colEl);
      return colEl;
    };
    newCol();

    slots.forEach((slot, si) => {
      if (multi && inCol >= perCol) newCol();
      const isLastSlot = si === slots.length - 1;

      if (slot.kind === 'h') {
        this.addRow(colEl, slot.hIdx, colIdx, rowH);
      } else {
        // торец начала — над левым столбцом, торец конца — под последней полоской правого
        const stretch = !multi || (slot.kind === 'bottom' && isLastSlot);
        this.addCap(colEl, slot.kind, colIdx, stretch ? null : rowH);
      }
      inCol++;
    });

    this.cacheCenters();

    if (!this.isMobile) {
      rail.addEventListener('mouseenter', () => { this.railHovered = true; this.onGroupEnter(); });
      rail.addEventListener('mouseleave', () => { this.railHovered = false; this.scheduleGroupLeave(); });
    } else {
      // протяжка пальцем вдоль рельса — основной способ листать на телефоне
      rail.addEventListener('touchmove', (e) => this.touchMove(e, true), { passive: false });
      rail.addEventListener('touchstart', () => { this.railTouch = true; }, { passive: true });
      rail.addEventListener('touchend', () => { this.railTouch = false; this.touchEnd(); }, { passive: true });
      rail.addEventListener('touchcancel', () => { this.railTouch = false; this.touchEnd(); }, { passive: true });
    }
    if (!this.isMobile) rail.addEventListener('mousemove', (e) => {
      // волна обновляется всегда, в том числе во время протяжки —
      // иначе широкой остаётся та полоска, с которой начали
      this.queueWave(e);
      if (this.dragging || this.spaceHeld) this.scrubTo(e.clientY, e.clientX);
    });

    // протяжка: зажать кнопку и вести — документ едет вместе с курсором
    if (!this.isMobile) rail.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      if (e.ctrlKey || e.metaKey) return;   // это Ctrl+клик, а не протяжка
      e.preventDefault();
      this.dragging = true;
      this.movedWhileDown = false;
      this.downY = e.clientY;
      this.scrubTo(e.clientY, e.clientX);
    });

    if (!this.isMobile) rail.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.isOpen = !this.isOpen;
      this.applyPanelState();
    });

    rail.addEventListener('wheel', (e) => {
      if (this.isPanelVisible() && this.panelListEl) {
        e.preventDefault();
        e.stopPropagation();
        this.panelTarget = null;
        this.panelListEl.scrollTop += e.deltaY;
        return;
      }
      // Структура свёрнута — колесо над рельсом крутит сам документ,
      // но заметно быстрее обычного: удобно долистывать длинные заметки,
      // не уводя курсор на сам текст.
      if (this.scrollTarget) {
        e.preventDefault();
        e.stopPropagation();
        this.cancelAnim();
        this.pinnedIdx = null;
        const max = Math.max(0, this.scrollTarget.scrollHeight - this.scrollTarget.clientHeight);
        const next = this.scrollTarget.scrollTop + e.deltaY * RAIL_WHEEL_BOOST;
        this.scrollTarget.scrollTop = Math.max(0, Math.min(max, next));
      }
    }, { passive: false });

    /* --- обёртка: поиск и структура --- */
    const side = host.createDiv({ cls: 'hr-side' });
    this.sideEl = side;
    side.classList.toggle('hr-search-bottom', !!this.settings.searchAtBottom);

    // высота ограничена размахом полосок: от верхней до нижней
    // Предел высоты — вся свободная высота рельса, а не размах полосок.
    // Привязка к полоскам зажимала структуру на коротких заметках: полосок мало,
    // размах крошечный, и список сжимался до пары строк. Теперь верх и низ
    // структуры могут выходить за крайние полоски, и центровка не ломается.
    host.style.setProperty('--hr-span', usable + 'px');

    if (this.settings.showSearch) {
      const search = side.createDiv({ cls: 'hr-search' });
      const input = search.createEl('input', { cls: 'hr-search-input' });
      input.setAttr('type', 'text');
      input.setAttr('placeholder', t('searchPlaceholder'));
      input.addEventListener('input', () => this.applyFilter(input.value));
      input.addEventListener('keydown', (e) => {
        e.stopPropagation();            // набор текста не должен трогать навигацию
        if (e.key === 'Escape') { input.value = ''; this.applyFilter(''); }
      });
      this.searchInput = input;
    }

    const panel = side.createDiv({ cls: 'hr-panel' });
    this.panelEl = panel;

    const list = panel.createDiv({ cls: 'hr-panel-list' });
    this.panelListEl = list;
    this.panelItems = [];

    this.headings.forEach((h, idx) => {
      const item = list.createDiv({ cls: 'hr-panel-item hr-lvl-' + h.level });
      item.setText(h.heading);
      item.addEventListener('click', (e) => {
        if (this.suppressTap) return;   // это было удержание

        // На телефоне нет Shift и Alt: пока есть выбранное, тап добавляет
        // и убирает пункты из выбора, а не переходит по документу.
        if (this.isMobile) {
          if (this.selected.size) {
            if (this.selected.has(idx)) this.selected.delete(idx);
            else this.selected.add(idx);
            this.renderSelection();
            if (this.selected.size) this.showItemMenu(idx);
            return;
          }
          this.animateScrollTo(this.stopOfHeading(idx));
          return;
        }

        // по нажатию на уже выделенную группу показываем действия,
        // а не переходим — выбор при этом сохраняется
        if (!e.shiftKey && !e.altKey && this.selected.size > 1 && this.selected.has(idx)) {
          e.preventDefault();
          this.showItemMenu(idx);
          return;
        }
        this.hideItemMenu();

        if (e.shiftKey && this.anchorIdx !== null) {
          // Shift — выделить диапазон от опорного пункта
          e.preventDefault();
          const a = Math.min(this.anchorIdx, idx);
          const b = Math.max(this.anchorIdx, idx);
          this.selected.clear();
          for (let k = a; k <= b; k++) {
            // при активном поиске между краями диапазона есть скрытые пункты:
            // выделять их нельзя, иначе удалилось бы больше, чем человек видит
            if (this.panelItems[k] && this.panelItems[k].classList.contains('hr-hidden')) continue;
            this.selected.add(k);
          }
          this.renderSelection();
          return;
        }
        if (e.altKey) {
          // Alt — добавить или убрать один пункт
          e.preventDefault();
          if (this.selected.has(idx)) this.selected.delete(idx);
          else this.selected.add(idx);
          this.anchorIdx = idx;
          this.renderSelection();
          return;
        }

        // Обычный клик — только переход. Серая рамка выделения появляется
        // по правой кнопке, Shift и Alt: она означает «выбрано для действия»,
        // а не «здесь я сейчас нахожусь».
        this.selected.clear();
        this.anchorIdx = idx;
        this.renderSelection();
        this.animateScrollTo(this.stopOfHeading(idx));
      });
      const openActions = () => {
        // если пункт не был выбран, выбираем только его;
        // выделенную группу сохраняем как есть
        if (!this.selected.has(idx)) {
          this.selected.clear();
          this.selected.add(idx);
          this.anchorIdx = idx;
          this.renderSelection();
        }
        this.showItemMenu(idx);
      };

      if (this.isMobile) {
        item.addEventListener('touchstart', (e) => this.touchStart(e, openActions), { passive: true });
        item.addEventListener('touchmove', (e) => this.touchMove(e, false), { passive: true });
        item.addEventListener('touchend', () => this.touchEnd(), { passive: true });
        item.addEventListener('touchcancel', () => this.touchEnd(), { passive: true });
      } else {
        item.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openActions();
        });
        item.addEventListener('mouseenter', () => {
          this.setRailHover(idx);
          this.showPreview(idx, item);
        });
        item.addEventListener('mouseleave', () => {
          this.setRailHover(-1);
          this.hidePreview();
        });
      }
      this.panelItems.push(item);
    });

    panel.addEventListener('wheel', (e) => {
      if (!this.panelListEl) return;
      e.stopPropagation();
      this.panelTarget = null;
      const before = this.panelListEl.scrollTop;
      this.panelListEl.scrollTop += e.deltaY;
      if (this.panelListEl.scrollTop !== before) e.preventDefault();
    }, { passive: false });

    this.menuEl = panel.createDiv({ cls: 'hr-item-menu' });
    this.menuEl.addEventListener('mouseleave', () => {
      if (this.menuEl && this.menuEl.classList.contains('is-ghost')) {
        this.holdOpen = false;
        this.hideItemMenu();
        // не полагаемся на то, что браузер отдельно сообщит об уходе с панели:
        // проверяем сами, а проверка сама же и отменится, если курсор внутри
        this.scheduleGroupLeave();
      }
    });

    this.edgeTop = panel.createDiv({ cls: 'hr-edge hr-edge-top' });
    this.edgeBottom = panel.createDiv({ cls: 'hr-edge hr-edge-bottom' });
    this.edgeTop.setAttr('aria-label', t('jumpAboveLabel'));
    this.edgeBottom.setAttr('aria-label', t('jumpBelowLabel'));
    this.edgeTop.addEventListener('click', () => this.syncPanelTo(this.activeIndex, true));
    this.edgeBottom.addEventListener('click', () => this.syncPanelTo(this.activeIndex, true));

    side.addEventListener('mouseenter', () => { this.panelHovered = true; this.onGroupEnter(); });
    side.addEventListener('mouseleave', () => { this.panelHovered = false; this.scheduleGroupLeave(); });

    // по бегунку на столбец: видимая зона структуры делится между ними
    this.markerEls = this.colEls.map((c) => {
      const m = c.createDiv({ cls: 'hr-marker' });
      m.style.height = MARKER_MIN_H + 'px';
      return m;
    });

    window.setTimeout(() => { this.cacheItemMetrics(); this.updateMarker(); }, 0);

    list.addEventListener('scroll', () => {
      if (this.rafMarker) return;
      this.rafMarker = true;
      requestAnimationFrame(() => {
        this.rafMarker = false;
        this.updateMarker();
        this.updateEdges();
        this.positionItemMenu();
      });
    }, { passive: true });
  }

  // Полоска одного заголовка
  // Цвет, скорость отклика и прочее оформление — через переменные CSS,
  // чтобы настройки применялись без перестроения разметки.
  /* Цвет с учётом темы.

     Подстраиваются только цвета, пришедшие из готового набора: автор набора
     подбирал их под свою тему и не знал, какая будет у вас. Цвет, который
     человек выставил сам, не трогается никогда — даже если он получился
     почти как фон. Раньше подстройка лезла и туда: тёмно-синий фон подсказки
     на тёмной теме превращался в белый, а выбранный цвет заголовка
     переворачивался обратно в тот, что был, и казалось, что настройка не
     работает. Настройки — закон. */
  tint(value, key) {
    if (!value) return value;
    if (!this.settings || this.settings.followTheme === false) return value;
    const prof = this.isMobile ? 'mobile' : 'desktop';
    const map = (this.settings.themedColors || {})[prof] || {};
    if (!key || !map[key]) return value;
    let light = false;
    try { light = document.body.classList.contains('theme-light'); } catch (e) { /* нет тела */ }
    return adaptToTheme(value, light);
  }

  applyLookVars(host) {
    const st = this.p;
    host.style.setProperty('--hr-bar-thickness', (Number(st.barThickness) || 3) + 'px');
    host.style.setProperty('--hr-bar-opacity', (Number(st.barOpacity) || 100) / 100);
    // одно скругление на всё: окошко подсказки, список структуры, поиск
    const radius = Math.max(0, numOr(st.uiRadius, 16));
    host.style.setProperty('--hr-radius', radius + 'px');
    host.style.setProperty('--hr-preview-radius', radius + 'px');
    host.style.setProperty('--hr-panel-radius', radius + 'px');
    if (st.previewBg) host.style.setProperty('--hr-preview-bg', this.tint(st.previewBg, 'previewBg'));
    else host.style.removeProperty('--hr-preview-bg');

    // Окошко подсказки: расстояние, ширина, форма и шрифты
    host.style.setProperty('--hr-preview-gap', Math.max(0, numOr(st.previewGap, 12)) + 'px');
    const pw = Math.max(120, numOr(st.previewWidth, 260));
    host.style.setProperty('--hr-preview-w', pw + 'px');
    host.style.setProperty('--hr-preview-title-size', Math.max(8, numOr(st.previewTitleSize, 13)) + 'px');
    host.style.setProperty('--hr-preview-title-weight', String(Math.round(numOr(st.previewTitleWeight, 600))));
    host.style.setProperty('--hr-preview-title-font', FONT_STACKS[st.previewTitleFont] || FONT_STACKS.interface);
    host.style.setProperty('--hr-preview-text-size', Math.max(8, numOr(st.previewTextSize, 12)) + 'px');
    host.style.setProperty('--hr-preview-text-weight', String(Math.round(numOr(st.previewTextWeight, 400))));
    host.style.setProperty('--hr-preview-text-font', FONT_STACKS[st.previewTextFont] || FONT_STACKS.interface);
    host.style.setProperty('--hr-preview-line', (Math.max(80, numOr(st.previewLineHeight, 145)) / 100).toFixed(2));

    // Цвета текста: пусто — берём цвет темы, поэтому просто снимаем переменную
    const paint = (name, value) => {
      if (value) host.style.setProperty(name, value);
      else host.style.removeProperty(name);
    };
    paint('--hr-preview-title-color', this.tint(st.previewTitleColor, 'previewTitleColor'));
    paint('--hr-preview-text-color', this.tint(st.previewTextColor, 'previewTextColor'));
    host.style.setProperty('--hr-panel-gap', Math.max(0, numOr(st.panelGap, 8)) + 'px');
    host.style.setProperty('--hr-active-fade',
      (Math.max(0, Math.min(100, numOr(st.activeOpacity, 100))) / 100).toFixed(2));
    paint('--hr-panel-bg', this.tint(st.panelBg, 'panelBg'));
    paint('--hr-panel-text', this.tint(st.panelText, 'panelText'));
    paint('--hr-panel-active-text', this.tint(st.panelActiveText, 'panelActiveText'));
    host.style.setProperty('--hr-bar-color', this.tint(st.barColor, 'barColor') || 'var(--text-faint)');
    host.style.setProperty('--hr-bar-hover', this.tint(st.barColor, 'barColor') || 'var(--text-muted)');
    host.style.setProperty('--hr-bar-active', this.tint(st.activeColor, 'activeColor') || 'var(--text-normal)');

    // Цвет волны и её значения «в покое»: пока волны нет, полоски берут
    // именно их, поэтому покой настраивается отдельно от пика.
    host.style.setProperty('--hr-wave-color', this.tint(st.waveColor, 'waveColor') || 'var(--text-normal)');
    host.style.setProperty('--hr-rest-mix', Math.max(0, numOr(st.restBright, 0)) + '%');
    host.style.setProperty('--hr-rest-fade', Math.max(0, numOr(st.restOpacity, 100)) / 100);

    // Подсветка положения: свой цвет и то, насколько она подтягивает
    // полоску к полной плотности поверх общей прозрачности
    if (st.glowColor) host.style.setProperty('--hr-glow-color', this.tint(st.glowColor, 'glowColor'));
    else host.style.removeProperty('--hr-glow-color');
    host.style.setProperty('--hr-glow-lift',
      (Math.max(0, Math.min(100, numOr(st.glowLift, 70))) / 100).toFixed(2));
  }

  // Цвет конкретной полоски. При переходе цвета каждая берёт свой оттенок
  // по положению в списке — вместе они и составляют плавный переход.
  barColorAt(idx, total) {
    const st = this.settings;
    if (!st.useGradient) return null;

    const mix = total > 1 ? idx / (total - 1) : 0;
    const from = this.parseColor(this.tint(st.gradientFrom, 'gradientFrom')) || [139, 124, 255];
    const to = this.parseColor(this.tint(st.gradientTo, 'gradientTo')) || [78, 197, 255];
    const c = from.map((v, i) => Math.round(v + (to[i] - v) * mix));
    return 'rgb(' + c.join(', ') + ')';
  }

  parseColor(v) {
    const hex = String(v || '').trim().replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  }

  // Длина полоски в покое: своя для каждого уровня заголовка, сверху общий
  // множитель — чтобы можно было укрупнить или ужать весь рельс одним ползунком.
  levelWidth(level) {
    const lvl = Math.max(1, Math.min(6, Number(level) || 3));
    const own = numOr(this.p['lvlW' + lvl], BASE_W[lvl] || 8);
    const scale = Math.max(0.2, numOr(this.p.barWidth, 100) / 100);
    return Math.max(2, Math.round(own * scale));
  }

  // Насколько длинной полоска становится на пике волны при нынешних настройках.
  // Нужна, чтобы знать, сколько места полоски отбирают у подсказки и структуры.
  peakBarWidth() {
    const cfg = this.p;
    const gain = Math.max(0, numOr(cfg.waveIntensity, 100)) / 100;
    let longest = 0;
    for (let lvl = 1; lvl <= 6; lvl++) longest = Math.max(longest, this.levelWidth(lvl));
    const peak = (cfg.waveCurve || 'bell') === 'custom'
      ? Math.max(longest, this.stepLength(0))
      : cfg.peakMode === 'add'
        ? longest + Math.max(0, numOr(cfg.peakAdd, 48))
        : Math.max(longest, numOr(cfg.peakLength, FALLBACK_PEAK));
    return Math.round(longest + (peak - longest) * Math.min(1.5, gain));
  }

  // Длина торцевых полосок — начала и конца документа
  capBarWidth() {
    const scale = Math.max(0.2, numOr(this.p.barWidth, 100) / 100);
    return Math.max(2, Math.round(numOr(this.p.capWidth, CAP_W) * scale));
  }

  addRow(colEl, hIdx, colIdx, rowH) {
    const h = this.headings[hIdx];
    const row = colEl.createDiv({ cls: 'hr-row' });
    row.style.height = rowH + 'px';

    const bar = row.createDiv({ cls: 'hr-bar' });
    const w = this.levelWidth(h.level);
    // толщина и непрозрачность тоже свои у каждого уровня заголовка
    const lvl = Math.max(1, Math.min(6, Number(h.level) || 3));
    const th = Math.max(10, numOr(this.p['lvlT' + lvl], 100)) / 100;
    const op = Math.max(0, Math.min(100, numOr(this.p['lvlO' + lvl], 100))) / 100;
    if (th !== 1) bar.style.setProperty('--hr-level-thick', th.toFixed(3));
    if (op !== 1) bar.style.setProperty('--hr-level-fade', op.toFixed(3));
    bar.style.setProperty('--hr-base-w', w + 'px');
    bar.style.width = w + 'px';
    bar.setAttr('aria-label', h.heading);

    const grad = this.barColorAt(hIdx, this.headings.length);
    if (grad) bar.style.setProperty('--hr-bar-own', grad);

    const stopI = this.stops.length;

    if (!this.isMobile) {
      row.addEventListener('mouseenter', () => {
        row.addClass('is-hover');
        this.setPanelHover(hIdx);
        if (!this.dragging && !this.spaceHeld) this.syncPanelTo(hIdx);
        this.showPreview(hIdx, row);
        // прокрутка сразу по наведению, без нажатия — по желанию
        if (this.p.hoverScrolls && !this.dragging && !this.spaceHeld) {
          this.cancelAnim();
          this.pinnedIdx = hIdx;
          this.setActive(hIdx);
          const target = this.targetScrollFor(stopI);
          if (target !== null && this.scrollTarget) this.scrollTarget.scrollTop = target;
        }
      });
      row.addEventListener('mouseleave', () => {
        row.removeClass('is-hover');
        this.setPanelHover(-1);
        this.hidePreview();
      });
      row.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.togglePanelAt(hIdx);
      });
    }

    row.addEventListener('click', () => {
      if (this.movedWhileDown) return;
      if (this.suppressTap) return;   // это было удержание или протяжка пальцем
      // Ctrl здесь намеренно не обрабатывается: пока клавиша удерживается,
      // структура показана временно, и клик должен просто выбирать место
      this.animateScrollTo(stopI);
    });

    if (this.isMobile) {
      // Удержание заменяет правую кнопку, движение пальцем — протяжку
      row.addEventListener('touchstart', (e) => this.touchStart(e, () => this.togglePanelAt(hIdx)),
        { passive: true });
    }

    this.stops.push({ el: row, bar, kind: 'h', hIdx, baseW: w, col: colIdx });
  }

  // Торец: начало или конец документа
  addCap(colEl, kind, colIdx, fixedH) {
    const quiet = this.p.capsMode === 'quiet';
    const cap = colEl.createDiv({ cls: 'hr-end hr-end-' + kind + (quiet ? ' hr-end-quiet' : '') });
    const capTh = Math.max(10, numOr(this.p.capThick, 100)) / 100;
    const capOp = Math.max(0, Math.min(100, numOr(this.p.capOpacity, 75))) / 100;
    if (fixedH !== null && fixedH !== undefined) {
      cap.style.height = fixedH + 'px';
      cap.style.flex = '0 0 auto';
    }
    const bar = cap.createDiv({ cls: 'hr-cap-bar' });
    const capW = this.capBarWidth();
    bar.style.setProperty('--hr-cap-thick', capTh.toFixed(3));
    bar.style.setProperty('--hr-cap-fade', capOp.toFixed(3));
    bar.style.setProperty('--hr-base-w', capW + 'px');
    bar.style.width = capW + 'px';
    bar.setAttr('aria-label', kind === 'top' ? t('startOfDoc') : t('endOfDoc'));

    const stopI = this.stops.length;
    if (!quiet) cap.addEventListener('click', () => {
      if (this.movedWhileDown) return;
      this.animateScrollTo(stopI);
    });

    this.stops.push({ el: cap, bar, kind, hIdx: -1, baseW: capW, col: colIdx });
  }

  stopOfHeading(hIdx) {
    for (let i = 0; i < this.stops.length; i++) {
      if (this.stops[i].kind === 'h' && this.stops[i].hIdx === hIdx) return i;
    }
    return 0;
  }

  /* --------------------------- геометрия остановок --------------------------- */

  // Центр берём у самой видимой полоски: у торцов зона огромная,
  // и её середина не совпала бы с положением линии
  stopCenter(i) {
    if (this.centers && this.centers[i] !== undefined) return this.centers[i];
    const bar = this.stops[i].bar;
    return bar.offsetTop + bar.offsetHeight / 2;
  }

  // Центры считаются один раз после построения: при прокрутке они не меняются,
  // а замер в каждом кадре заставлял браузер пересчитывать раскладку
  cacheCenters() {
    this.centers = this.stops.map((st) => st.bar.offsetTop + st.bar.offsetHeight / 2);
  }

  // Какой столбец под курсором. Если курсор ушёл вбок (протяжка) — держим прежний.
  colAtClientX(clientX) {
    if (!this.colEls || this.colEls.length < 2) return 0;
    if (clientX === undefined || clientX === null) return this.activeCol || 0;
    let best = this.activeCol || 0;
    let bestD = Infinity;
    for (let c = 0; c < this.colEls.length; c++) {
      const r = this.colEls[c].getBoundingClientRect();
      const d = clientX < r.left ? r.left - clientX : (clientX > r.right ? clientX - r.right : 0);
      if (d < bestD) { bestD = d; best = c; }
    }
    return best;
  }

  // Ближайшая остановка: сначала столбец по горизонтали, потом полоска по вертикали
  stopAtClientY(clientY, clientX) {
    const rect = this.railEl.getBoundingClientRect();
    const y = clientY - rect.top;
    const col = this.colAtClientX(clientX);
    this.activeCol = col;

    let best = -1;
    let bestD = Infinity;
    for (let i = 0; i < this.stops.length; i++) {
      if (this.stops[i].col !== col) continue;
      const d = Math.abs(this.stopCenter(i) - y);
      if (d < bestD) { bestD = d; best = i; }
    }
    if (best === -1) {
      for (let i = 0; i < this.stops.length; i++) {
        const d = Math.abs(this.stopCenter(i) - y);
        if (d < bestD) { bestD = d; best = i; }
      }
    }
    return best;
  }

  // Куда прокручивать документ для данной остановки
  targetScrollFor(i) {
    const st = this.scrollTarget;
    const stop = this.stops[i];
    if (!st || !stop) return null;

    const max = Math.max(0, st.scrollHeight - st.clientHeight);
    if (stop.kind === 'top') return 0;
    if (stop.kind === 'bottom') return max;

    const own = !this.measureRect;
    if (own) this.beginMeasure();
    const top = this.headingTop(stop.hIdx);
    if (own) this.endMeasure();

    if (top === null) return null;

    /* Куда именно поставить заголовок. Сверху — привычно на компьютере, где
       под заголовком сразу видно много текста. На телефоне экран узкий и
       высокий, и заголовок у самой кромки читается плохо: там удобнее, когда
       он встаёт примерно на треть высоты сверху. */
    const place = this.p.scrollTo || 'top';
    let margin = JUMP_MARGIN;
    if (place === 'center') margin = st.clientHeight / 2;
    else if (place === 'upper') margin = st.clientHeight / 3;
    return Math.max(0, Math.min(max, top - margin));
  }

  /* ------------------------------- волна ------------------------------- */

  /* Волна разложена на три независимые части:

     1) приём точки — queueWave: курсор задаёт только цель, не картинку;
     2) ход времени — stepWavePosition и stepWaveAmplitude: где волна сейчас
        и насколько она сильна, два числа, больше ничего;
     3) раскраска — applyWave: сила волны у каждой полоски превращается в
        длину, толщину, яркость и прозрачность.

     Разделение сделано ради настроек: раскраска не знает, откуда взялась
     сила, поэтому любое свойство внешности можно привязать к волне или
     отвязать от неё, не трогая движение, и наоборот. */

  waveState() {
    if (!this.wave) {
      this.wave = {
        y: null,      // где волна сейчас, px от верха рельса
        vy: 0,        // её скорость, px/с
        amp: 0,       // сила волны: 0 — нет, 1 — во всю мощь
        aim: 0,       // к какой силе стремимся: 1 пока курсор здесь
        tY: 0,        // цель по высоте
        tX: null,     // положение курсора поперёк рельса
        raf: 0,
        last: 0,
        phase: 0,     // доля пройденного времени разгона или угасания
      };
    }
    return this.wave;
  }

  queueWave(e) {
    if (this.waveBlocked) return;
    const rect = this.railEl && this.railEl.getBoundingClientRect();
    if (!rect) return;

    const w = this.waveState();
    this.pendingPointer = { x: e.clientX, y: e.clientY };
    w.tRaw = e.clientY - rect.top;
    w.tX = e.clientX;
    w.tY = this.waveTarget(w.tRaw, e.clientX);
    w.aim = 1;
    // первое появление: ставим волну сразу на место, иначе она приедет издалека
    if (w.y === null) { w.y = w.tY; w.vy = 0; }
    this.runWave();
  }

  /* Куда тянется волна.

     Свободно — прямо в точку под курсором. Тогда при положении между двумя
     полосками они делят силу, и малое движение курсора шевелит обеих.

     С привязкой — в центр той полоски, над которой курсор сейчас находится.
     Пустое место между полосками делится ровно пополам, поэтому, пока курсор
     не пересёк границу, цель не меняется и соседи не пляшут. А когда граница
     пересечена, цель сдвигается на одну полоску, и волна переезжает туда так
     же плавно, как она двигалась бы за курсором. */
  waveTarget(rawY, clientX) {
    if ((this.p.centerMode || 'snap') === 'free') return rawY;
    if (!this.stops.length) return rawY;

    const col = this.colAtClientX(clientX);
    let bestY = rawY, best = Infinity;
    for (let i = 0; i < this.stops.length; i++) {
      if (this.stops[i].col !== col) continue;
      const c = this.stopCenter(i);
      const d = Math.abs(c - rawY);
      if (d < best) { best = d; bestY = c; }
    }
    return bestY;
  }

  // Курсор ушёл: волну не обрываем, а даём ей погаснуть
  fadeWave() {
    this.waveState().aim = 0;
    this.runWave();
  }

  resetWave() {
    const w = this.waveState();
    if (w.raf) { cancelAnimationFrame(w.raf); w.raf = 0; }
    this.clearWavePaint();
    this.pendingPointer = null;
    w.y = null; w.vy = 0; w.amp = 0; w.aim = 0; w.last = 0; w.tX = null; w.tRaw = null; w.phase = 0;
  }

  runWave() {
    const w = this.waveState();
    if (w.raf) return;

    const tick = (now) => {
      w.raf = 0;
      if (!this.railEl || !this.stops.length) return;

      // Шаг времени в секундах. Верхняя граница нужна на случай, когда вкладка
      // была свёрнута: иначе один кадр длиной в минуту выбросит волну за экран.
      const dt = Math.min(0.05, w.last ? (now - w.last) / 1000 : 1 / 60);
      w.last = now;

      this.stepWavePosition(dt);
      this.stepWaveAmplitude(dt);
      this.applyWave();

      // погасла совсем — снимаем всё, что дорисовывали
      if (w.aim === 0 && w.amp <= 0.004) {
        this.clearWavePaint();
        w.y = null; w.vy = 0; w.amp = 0; w.last = 0; w.phase = 0;
        return;
      }
      // доехала и стоит на месте — цикл можно остановить, картинка уже верная
      const steady = w.aim === 1 && w.amp > 0.996 &&
                     Math.abs(w.tY - w.y) < 0.3 && Math.abs(w.vy) < 1;
      if (steady) { w.amp = 1; w.phase = 1; w.y = w.tY; w.vy = 0; w.last = 0; return; }

      w.raf = requestAnimationFrame(tick);
    };

    w.raf = requestAnimationFrame(tick);
  }

  // Где волна сейчас. Пружина с двумя понятными ручками: за сколько волна
  // догоняет курсор и насколько проскакивает мимо него при резком движении.
  stepWavePosition(dt) {
    const w = this.waveState();
    const follow = Math.max(0, numOr(this.p.followTime, 70));
    if (follow < 8) { w.y = w.tY; w.vy = 0; return; }   // «мгновенно»

    const over = Math.max(0, Math.min(100, numOr(this.p.overshoot, 0))) / 100;
    const omega = 4 / (follow / 1000);   // жёсткость: чем короче время, тем выше
    const zeta = 1 - over * 0.86;        // 1 — приходит и останавливается, меньше — пружинит

    // Считаем мелкими шагами: при высокой жёсткости один длинный шаг
    // раскачивает счёт до бесконечности вместо плавного движения.
    const steps = Math.max(1, Math.min(8, Math.ceil((omega * dt) / 0.25)));
    const h = dt / steps;
    for (let s = 0; s < steps; s++) {
      const accel = omega * omega * (w.tY - w.y) - 2 * zeta * omega * w.vy;
      w.vy += accel * h;
      w.y += w.vy * h;
    }
  }

  /* Насколько волна сильна прямо сейчас.

     Раньше сила догоняла цель экспонентой: большая часть пути проходилась в
     первые же кадры, а хвост тянулся долго. На глаз это читается как «дёрнулось
     и поползло» — ровно то, чего не хочется. Поэтому здесь не затухание, а
     равномерный ход по времени: за указанные миллисекунды доля проходит от 0
     до 1 линейно, а сглаживание накладывается сверху. Начало и конец движения
     получаются мягкими, а середина — ровной. */
  stepWaveAmplitude(dt) {
    const w = this.waveState();
    const ms = w.aim === 1
      ? Math.max(0, numOr(this.p.riseTime, 110))
      : Math.max(0, numOr(this.p.fallTime, 260));
    if (ms < 8) { w.amp = w.aim; w.phase = w.aim; return; }

    if (w.phase === undefined) w.phase = w.amp;
    w.phase += ((w.aim ? 1 : -1) * dt * 1000) / ms;
    w.phase = Math.max(0, Math.min(1, w.phase));
    w.amp = smoothStep(w.phase);
    if (w.amp > 0.9999) w.amp = 1;
    if (w.amp < 0.0001) w.amp = 0;
  }

  /* Насколько сильна волна в зависимости от того, где курсор поперёк рельса.

     Две разные вещи, которые раньше были свалены в одну:

     1) Зона реакции. Полоски могут начинать отзываться ещё до того, как курсор
        дойдёт до рельса. К дальней границе зоны сила плавно сходит на нет,
        поэтому волна не выскакивает, а подходит вместе с курсором.
     2) Реакция на движение вбок внутри самого рельса. У края экрана волна
        сдержанная, при уводе в сторону текста — во всю ширину. Прежний предел
        был задан так, что внутри рельса полная сила не достигалась вовсе. */
  waveDepth() {
    const cfg = this.p;
    const w = this.waveState();
    if (w.tX === null || w.tX === undefined) return 1;

    const rect = this.railEl.getBoundingClientRect();
    const railW = Math.max(1, rect.width);
    // расстояние наружу от внутреннего края рельса: меньше нуля — курсор над рельсом
    const out = cfg.side === 'left' ? w.tX - rect.right : rect.left - w.tX;

    let zone = 1;
    const reactZone = Math.max(0, numOr(cfg.reactZone, 0));
    if (out > 0) {
      if (!reactZone || out > reactZone) return 0;
      zone = smoothStep(1 - out / reactZone);
    }

    if (!cfg.horizontalDepth) return zone;

    const range = Math.max(8, numOr(cfg.horizontalRange, 60));
    const floor = this.isMobile
      ? MOBILE_DEPTH_MIN
      : Math.max(0, Math.min(100, numOr(cfg.horizontalMin, 25))) / 100;
    // насколько курсор ушёл от края экрана внутрь: над рельсом out
    // отрицателен, так что это просто ширина рельса минус остаток до края
    const inward = railW + out;
    const frac = Math.max(0, Math.min(1, inward / range));
    return zone * (floor + (1 - floor) * frac);
  }

  /* Сила волны → внешность полоски. Каждое свойство идёт своим путём от
     значения «в покое» к значению «на пике», поэтому настройками получается
     и длина без цвета, и цвет без длины, и всё сразу.

     Форма задаётся одним из двух способов:

     кривой — сила считается по расстоянию в пикселях и выбранной кривой;
     ступенями — длина каждой полоски задана прямо в пикселях: центральная,
     первая соседняя, вторая и так далее, симметрично в обе стороны.

     В обоих случаях центр волны привязывается к конкретной полоске, а не
     висит между ними. Раньше при малом движении курсора соседняя полоска
     могла оказаться длиннее той, на которую наведено, — потому что сила
     делилась между двумя соседями поровну, а длина в покое у них разная. */
  applyWave() {
    const cfg = this.p;
    const w = this.waveState();
    const col = this.colAtClientX(w.tX);
    this.activeCol = col;

    const power = w.amp * this.waveDepth();
    const gain = Math.max(0, numOr(cfg.waveIntensity, 100)) / 100;

    // полоски текущего столбца по порядку — нужен их номер внутри столбца
    const inCol = [];
    for (let i = 0; i < this.stops.length; i++) {
      if (this.stops[i].col === col) inCol.push(i);
      else this.restoreBar(this.stops[i]);
    }
    if (!inCol.length || power <= 0.0005) {
      if (power <= 0.0005) for (const i of inCol) this.restoreBar(this.stops[i]);
      return;
    }

    // ближайшая к волне полоска: она и есть центр
    let centerAt = 0, best = Infinity;
    for (let k = 0; k < inCol.length; k++) {
      const d = Math.abs(this.stopCenter(inCol[k]) - w.y);
      if (d < best) { best = d; centerAt = k; }
    }

    const custom = (cfg.waveCurve || 'bell') === 'custom';
    const strengths = custom
      ? this.customStrengths(inCol, w.y)
      : this.curveStrengths(inCol, centerAt, w.y);

    const byTarget = cfg.peakMode !== 'add';
    const peakLen = Math.max(1, numOr(cfg.peakLength, FALLBACK_PEAK));
    const addLen = Math.max(0, numOr(cfg.peakAdd, 48));

    const brRest = numOr(cfg.restBright, 0) / 100;
    const brPeak = numOr(cfg.peakBright, 90) / 100;
    const opRest = numOr(cfg.restOpacity, 100) / 100;
    const opPeak = numOr(cfg.peakOpacity, 100) / 100;
    const thPeak = numOr(cfg.peakThick, 100) / 100;

    for (let k = 0; k < inCol.length; k++) {
      const stop = this.stops[inCol[k]];
      const s = strengths[k];
      if (!s || s <= 0.0005) { this.restoreBar(stop); continue; }

      const g = Math.min(4, s * power * gain);
      /* Своя форма задаёт наибольшую длину для каждого расстояния — до неё
         полоска дотягивается постепенно, вместе с силой волны, а не скачком.
         Между заданными ступенями длина считается плавным переходом, поэтому
         при движении курсора полоска растёт и опадает, а не щёлкает. */
      const peak = custom
        ? this.customPeak(Math.abs(this.stopCenter(inCol[k]) - w.y) / Math.max(1, this.rowH), stop.baseW)
        : byTarget ? Math.max(stop.baseW, peakLen) : stop.baseW + addLen;

      this.paintBar(
        stop,
        Math.max(1, stop.baseW + (peak - stop.baseW) * (custom ? Math.min(4, power * gain) : g)),
        Math.max(0, Math.min(100, (brRest + (brPeak - brRest) * g) * 100)),
        Math.max(0, Math.min(1, opRest + (opPeak - opRest) * g)),
        Math.max(0.1, 1 + (thPeak - 1) * g)
      );
    }
  }

  /* Своя форма: наибольшая длина задана ступенями — для расстояния в ноль
     полосок, в одну, в две и так далее. Между ступенями значение считается
     плавным переходом, поэтому форма остаётся непрерывной, хотя задана
     несколькими числами. */
  customPeak(u, baseW) {
    const half = Math.max(0, Math.floor((this.stepSpan() - 1) / 2));
    if (u >= half) return baseW;
    const lo = Math.floor(u);
    const frac = u - lo;
    const a = this.stepLength(lo);
    const b = lo + 1 > half ? baseW : this.stepLength(lo + 1);
    return a + (b - a) * smoothStep(frac);
  }

  // Сила своей формы — доля пути от покоя до самой длинной ступени.
  // Нужна для цвета, прозрачности и толщины: они идут за нарисованной формой.
  customStrengths(inCol, waveY) {
    const rest = this.levelWidth(3);
    const top = Math.max(rest + 1, this.stepLength(0));
    const out = new Array(inCol.length);
    for (let k = 0; k < inCol.length; k++) {
      const u = Math.abs(this.stopCenter(inCol[k]) - waveY) / Math.max(1, this.rowH);
      const len = this.customPeak(u, rest);
      out[k] = Math.max(0, Math.min(1, (len - rest) / (top - rest)));
    }
    return out;
  }

  // Форма кривой: сила по расстоянию в пикселях до центра волны
  curveStrengths(inCol, centerAt, waveY) {
    const cfg = this.p;
    const gain = Math.max(0, numOr(cfg.waveIntensity, 100)) / 100;
    const reachGain = 0.5 + 0.5 * Math.min(2, gain);
    const reach = Math.max(2, numOr(cfg.waveReach, 2.5) * this.rowH * reachGain);
    const curve = cfg.waveCurve || 'bell';
    const hardEdge = curve === 'step' || curve === 'wedge' || curve === 'cosine';
    const limit = reach * (hardEdge ? 1.02 : 3.4);

    const out = new Array(inCol.length);
    let top = 0;
    for (let k = 0; k < inCol.length; k++) {
      const dist = this.stopCenter(inCol[k]) - waveY;
      const v = Math.abs(dist) > limit ? 0 : waveStrength(curve, dist, reach, cfg.waveEdge);
      out[k] = v;
      if (v > top) top = v;
    }

    /* Чёткий центр: делим всё на самое большое значение, поэтому ближайшая
       к курсору полоска всегда доходит до полной длины, а соседи строго
       короче. Без этого при положении курсора ровно между полосками обе
       получали поровну и «главной» не было ни одной. */
    if (cfg.sharpCenter !== false && top > 0.0001 && top < 1) {
      for (let k = 0; k < out.length; k++) out[k] /= top;
    }
    return out;
  }

  // Сколько полосок задевает волна в режиме ступеней: всегда нечётное,
  // чтобы центральная была ровно одна, а по бокам — поровну
  stepSpan() {
    const raw = Math.max(1, Math.min(25, Math.round(numOr(this.p.waveSpan, 9))));
    return raw % 2 === 0 ? raw + 1 : raw;
  }

  // Длина полоски на ступени d, в пикселях
  stepLength(d) {
    const i = Math.max(0, Math.min(12, Math.round(d)));
    return Math.max(1, numOr(this.p['stepW' + i], 27));
  }

  // Пишем в разметку только то, что действительно изменилось: на длинной
  // заметке это разница между десятком правок за кадр и несколькими сотнями.
  paintBar(stop, width, mix, fade, thick) {
    const st = stop.bar.style;
    const prev = stop.paint;
    const w1 = Math.round(width * 10) / 10;
    const m1 = Math.round(mix * 10) / 10;
    const f1 = Math.round(fade * 1000) / 1000;
    const t1 = Math.round(thick * 1000) / 1000;

    if (!prev || prev.w !== w1) st.width = w1 + 'px';
    if (!prev || prev.m !== m1) st.setProperty('--hr-wave-mix', m1 + '%');
    if (!prev || prev.f !== f1) st.setProperty('--hr-wave-fade', String(f1));
    if (!prev || prev.t !== t1) st.setProperty('--hr-wave-thick', String(t1));
    stop.paint = { w: w1, m: m1, f: f1, t: t1 };
  }

  restoreBar(stop) {
    if (!stop.paint) return;
    const st = stop.bar.style;
    st.width = stop.baseW + 'px';
    st.removeProperty('--hr-wave-mix');
    st.removeProperty('--hr-wave-fade');
    st.removeProperty('--hr-wave-thick');
    stop.paint = null;
  }

  clearWavePaint() {
    for (const stop of this.stops) this.restoreBar(stop);
  }

  /* ------------------ протяжка: документ едет вместе с курсором ------------------ */

  scrubTo(clientY, clientX) {
    if (!this.stops.length || !this.scrollTarget) return;
    this.cancelAnim();

    const i = this.stopAtClientY(clientY, clientX);
    this.scrubStop = i;
    const stop = this.stops[i];
    if (stop.kind === 'h') {
      this.setActive(stop.hIdx);
      this.syncPanelTo(stop.hIdx);
    }

    if (this.scrubRaf === null || this.scrubRaf === undefined) this.runScrub();
  }

  runScrub() {
    // Защита от вечного вращения. Цикл мог не остановиться никогда в двух случаях:
    // кнопку отпустили за пределами окна (флаг протяжки оставался включённым)
    // или цель недостижима (документ упёрся в край, и разница не убывала).
    // Оба варианта непрерывно грузили процессор.
    const startedAt = Date.now();
    let stuckFrames = 0;
    let lastTop = null;

    const step = () => {
      if (!this.scrollTarget || this.scrubStop === undefined) { this.scrubRaf = null; return; }
      const target = this.targetScrollFor(this.scrubStop);
      if (target === null) { this.scrubRaf = null; return; }

      const st = this.scrollTarget;
      const diff = target - st.scrollTop;
      st.scrollTop = Math.abs(diff) < 1 ? target : st.scrollTop + diff * SCRUB_LERP;

      // прокрутка не сдвинулась — дальше ехать некуда
      if (lastTop !== null && Math.abs(st.scrollTop - lastTop) < 0.5) stuckFrames++;
      else stuckFrames = 0;
      lastTop = st.scrollTop;

      const holding = this.dragging || this.spaceHeld;
      const timedOut = Date.now() - startedAt > SCRUB_MAX_MS;

      if (stuckFrames > 12 || timedOut) {
        this.scrubRaf = null;
        if (timedOut) this.endScrub();
        return;
      }

      if (holding || Math.abs(diff) >= 1) {
        this.scrubRaf = requestAnimationFrame(step);
      } else {
        this.scrubRaf = null;
        this.settle(this.scrubStop, 0);
      }
    };
    this.scrubRaf = requestAnimationFrame(step);
  }

  endScrub() {
    const wasActive = this.dragging || this.spaceHeld;
    this.dragging = false;
    if (this.scrubRaf) { cancelAnimationFrame(this.scrubRaf); this.scrubRaf = null; }
    if (wasActive && this.scrubStop !== undefined) {
      const stop = this.stops[this.scrubStop];
      if (stop) {
        this.pinnedIdx = stop.kind === 'h' ? stop.hIdx : null;
        this.settle(this.scrubStop, 0);
      }
    }
  }

  onDocMouseMove(e) {
    if (!this.isMobile) this.trackReactZone(e);
    if (this.holdOpen) {
      const inside = this.pointerInsideWidget(e.clientX, e.clientY);
      if (!inside) {
        this.holdOpen = false;
        this.scheduleGroupLeave();
      }
    }
    if (!this.dragging) return;
    // кнопку могли отпустить за пределами окна — событие отпускания не придёт
    if (e.buttons === 0) { this.endScrub(); return; }
    if (Math.abs(e.clientY - this.downY) > 3) this.movedWhileDown = true;
    this.queueWave(e);   // курсор мог уйти вбок от рельса — волна всё равно следует за ним
    this.scrubTo(e.clientY, e.clientX);
  }

  /* Зона реакции: полоски начинают отзываться ещё до того, как курсор дойдёт
     до рельса. Событие движения мыши приходит очень часто, поэтому размеры
     рельса берём из кэша и обновляем его раз в четверть секунды. */
  trackReactZone(e) {
    const zone = Math.max(0, numOr(this.p.reactZone, 0));
    if (!zone || !this.railEl || this.waveBlocked || this.overRail) return;

    const now = Date.now();
    if (!this.zoneRect || now - this.zoneRectAt > 250) {
      this.zoneRect = this.railEl.getBoundingClientRect();
      this.zoneRectAt = now;
    }
    const r = this.zoneRect;
    const out = this.p.side === 'left' ? e.clientX - r.right : r.left - e.clientX;
    const inside = out <= zone && e.clientY >= r.top - 40 && e.clientY <= r.bottom + 40;

    if (inside) { this.inZone = true; this.queueWave(e); }
    else if (this.inZone) { this.inZone = false; this.fadeWave(); }
  }

  onDocMouseUp() {
    if (!this.dragging) return;
    this.endScrub();
    window.setTimeout(() => { this.movedWhileDown = false; }, 0);
  }

  /* --------------- переход к остановке: своя анимация с пересчётом --------------- */

  cancelAnim() {
    if (this.animId) { cancelAnimationFrame(this.animId); this.animId = null; }
    if (this.settleTimer) { clearTimeout(this.settleTimer); this.settleTimer = null; }
  }

  animateScrollTo(stopI) {
    const st = this.scrollTarget;
    if (!st || !this.stops[stopI]) return;

    this.cancelAnim();
    const start = st.scrollTop;
    const first = this.targetScrollFor(stopI);
    if (first === null) return;

    const dur = Math.min(ANIM_MAX, Math.max(ANIM_MIN, Math.abs(first - start) * 0.35));
    const t0 = performance.now();

    const stop = this.stops[stopI];
    if (stop.kind === 'h') {
      this.pinnedIdx = stop.hIdx;
      this.setActive(stop.hIdx);
      this.syncPanelTo(stop.hIdx, true);   // подвести выбранный раздел к центру структуры
    } else {
      this.pinnedIdx = null;
    }

    const step = (now) => {
      // цель пересчитывается каждый кадр: пока документ дорисовывается,
      // реальная позиция заголовка уточняется, и анимация едет уже к ней
      const target = this.targetScrollFor(stopI);
      if (target === null) { this.animId = null; return; }

      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      st.scrollTop = start + (target - start) * eased;

      if (p < 1) {
        this.animId = requestAnimationFrame(step);
      } else {
        this.animId = null;
        this.settle(stopI, 0);
      }
    };

    this.animId = requestAnimationFrame(step);
  }

  // Доводка: после анимации сверяемся с целью ещё несколько раз.
  // Именно это гарантирует попадание, даже если высота контента уточнилась в пути.
  settle(stopI, tries) {
    if (this.settleTimer) { clearTimeout(this.settleTimer); this.settleTimer = null; }
    if (tries >= SETTLE_TRIES) return;

    this.settleTimer = window.setTimeout(() => {
      this.settleTimer = null;
      const st = this.scrollTarget;
      if (!st || this.dragging || this.spaceHeld || this.animId) return;

      const target = this.targetScrollFor(stopI);
      if (target === null) return;

      if (Math.abs(st.scrollTop - target) > SETTLE_EPS) {
        st.scrollTop = target;
        this.settle(stopI, tries + 1);
      }
    }, SETTLE_STEP);
  }

  /* --------------------------------- панель ---------------------------------- */

  isPanelVisible() {
    return this.isOpen || (this.ctrlTemp && this.overRail);
  }

  // Курсор в пределах рельса или раскрытой структуры
  pointerInsideWidget(x, y) {
    const boxes = [];
    if (this.railEl) boxes.push(this.railEl.getBoundingClientRect());
    if (this.sideEl && this.isPanelVisible()) boxes.push(this.sideEl.getBoundingClientRect());
    for (const r of boxes) {
      if (x >= r.left - 12 && x <= r.right + 12 && y >= r.top - 12 && y <= r.bottom + 12) return true;
    }
    return false;
  }

  onGroupEnter() {
    if (this.leaveTimer) { clearTimeout(this.leaveTimer); this.leaveTimer = null; }
    this.overRail = true;
    this.applyPanelState();
  }

  scheduleGroupLeave() {
    if (this.leaveTimer) clearTimeout(this.leaveTimer);
    this.leaveTimer = window.setTimeout(() => {
      this.leaveTimer = null;
      if (this.railHovered || this.panelHovered) return;
      if (this.dragging) return;   // тянем — курсор мог уйти вбок, это не уход
      // Нажатая кнопка меню исчезает прямо из-под курсора, и браузер сообщает
      // об уходе мыши, хотя пользователь ничего никуда не уводил. Держим открытым
      // до настоящего движения мыши в сторону — см. onDocMouseMove.
      if (this.holdOpen) return;

      this.overRail = false;
      this.fadeWave();
      this.setPanelHover(-1);
      this.setRailHover(-1);
      this.hidePreview();
      this.hideItemMenu();
      this.applyPanelState();
      // структура остаётся там, где её оставили: вместо отката появляются
      // указатели у края, если активное место ушло за пределы видимой зоны
      this.updateEdges();
    }, GROUP_LEAVE_DELAY);
  }

  renderSelection() {
    this.panelItems.forEach((it, i) => it.classList.toggle('is-selected', this.selected.has(i)));
    if (!this.selected.size) this.hideItemMenu();
  }

  // Прокрутка структуры своей анимацией. Штатная плавная прокрутка при каждом
  // новом наведении начиналась заново и не догоняла быстрое движение мыши;
  // здесь повторный вызов лишь меняет цель, а движение не прерывается.
  panelScrollTo(top) {
    const list = this.panelListEl;
    if (!list) return;

    const max = Math.max(0, list.scrollHeight - list.clientHeight);
    this.panelTarget = Math.max(0, Math.min(max, top));

    if (this.panelRaf) return;

    let stuck = 0;
    let last = null;
    const step = () => {
      const el = this.panelListEl;
      if (!el || this.panelTarget === null) { this.panelRaf = null; return; }

      const diff = this.panelTarget - el.scrollTop;
      if (Math.abs(diff) < 0.5) {
        el.scrollTop = this.panelTarget;
        this.panelRaf = null;
        return;
      }
      el.scrollTop = el.scrollTop + diff * PANEL_LERP;

      // цель может быть недостижима — не крутим цикл впустую
      if (last !== null && Math.abs(el.scrollTop - last) < 0.1) stuck++;
      else stuck = 0;
      last = el.scrollTop;
      if (stuck > 6) { this.panelRaf = null; return; }

      this.panelRaf = requestAnimationFrame(step);
    };
    this.panelRaf = requestAnimationFrame(step);
  }

  /* ------------------------- касания (только телефон) ------------------------- */

  // Полагаться на один признак оказалось ненадёжно: если он недоступен,
  // весь мобильный код молча не включался и телефон вёл себя как компьютер.
  // Поэтому проверяем несколькими способами, включая класс, который сам
  // Obsidian вешает на страницу в мобильном приложении.
  detectMobile() {
    try {
      if (typeof Platform !== 'undefined' && Platform) {
        if (Platform.isMobile === true) return true;
        if (Platform.isMobileApp === true) return true;
        if (Platform.isPhone === true || Platform.isTablet === true) return true;
      }
    } catch (e) { /* признак недоступен — пробуем следующий */ }

    try {
      if (document.body && document.body.classList.contains('is-mobile')) return true;
    } catch (e) { /* и этот недоступен */ }

    return false;
  }


  registerMobileGlobals() {
    // Касание мимо структуры сворачивает её — привычное поведение на телефоне
    this.registerDomEvent(document, 'touchstart', (e) => {
      if (!this.isOpen) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      if (this.pointInside(this.sideEl, t.clientX, t.clientY)) return;
      if (this.pointInside(this.railEl, t.clientX, t.clientY)) return;  // рельс живёт своей жизнью
      this.isOpen = false;
      this.clearSelection();
      this.applyPanelState();
    }, { passive: true });

    // Появление клавиатуры ужимает видимую часть экрана. Раньше рельс просто
    // пересчитывался под остаток высоты, и полоски слипались в сплошную линию —
    // вместо этого убираем его целиком, пока клавиатура открыта.
    const vv = window.visualViewport;
    if (vv) {
      this.registerDomEvent(vv, 'resize', () => {
        /* Раньше высота видимой области сравнивалась с window.innerHeight.
           На части телефонов при появлении клавиатуры уменьшается и он тоже,
           отношение остаётся около единицы, и открытие клавиатуры не
           замечалось вовсе. Сравниваем с наибольшей высотой, которую окно
           показывало за этот сеанс: она меняется только при повороте. */
        this.kbFull = Math.max(this.kbFull || 0, vv.height);
        const open = vv.height < this.kbFull - 120;
        if (open === this.kbOpen) return;
        this.kbOpen = open;
        if (this.hostEl) this.hostEl.classList.toggle('hr-kb', open);

        if (open) {
          // если печатают в нашем же поиске, структуру оставляем — он сам вызвал клавиатуру
          const typingInSearch = this.searchInput && document.activeElement === this.searchInput;
          if (this.isOpen && !typingInSearch) {
            this.isOpen = false;
            this.applyPanelState();
          }
        } else {
          // высота вернулась — пересобираем под полный экран
          this.refresh(true);
        }
      });
    }
  }

  pointInside(el, x, y) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }


  // Общее начало касания: заводим таймер удержания и следим за сдвигом пальца.
  // Сдвиг больше порога означает, что человек тянет, а не удерживает.
  touchStart(e, onLongPress) {
    const t = e.touches && e.touches[0];
    if (!t) return;

    this.suppressTap = false;
    this.touchY = t.clientY;
    this.touchX = t.clientX;
    this.touchMoved = false;
    this.longPressFired = false;

    if (this.longPressTimer) clearTimeout(this.longPressTimer);
    this.longPressTimer = window.setTimeout(() => {
      this.longPressTimer = null;
      if (this.touchMoved) return;
      this.longPressFired = true;
      this.suppressTap = true;
      if (onLongPress) onLongPress();
    }, LONG_PRESS_MS);
  }

  touchMove(e, allowScrub) {
    const t = e.touches && e.touches[0];
    if (!t) return;

    if (!this.touchMoved &&
        (Math.abs(t.clientY - this.touchY) > TOUCH_SLOP ||
         Math.abs(t.clientX - this.touchX) > TOUCH_SLOP)) {
      this.touchMoved = true;
      if (this.longPressTimer) { clearTimeout(this.longPressTimer); this.longPressTimer = null; }
    }

    if (this.touchMoved && allowScrub && !this.longPressFired) {
      this.suppressTap = true;
      if (e.cancelable) e.preventDefault();   // иначе страница поедет вместе с протяжкой

      // События касания приходят чаще, чем экран успевает перерисоваться:
      // копим последнюю точку и обрабатываем раз в кадр, иначе заметно подлагивает
      this.queueWave({ clientX: t.clientX, clientY: t.clientY });
      // на телефоне наведения нет, поэтому подсказку показываем во время протяжки
      if (this.p.hoverPreview) {
        const st = this.stops[this.stopAtClientY(t.clientY, t.clientX)];
        if (st && st.kind === 'h') this.showPreview(st.hIdx, st.el);
      }
      if (this.touchRaf) return;
      this.touchRaf = requestAnimationFrame(() => {
        this.touchRaf = null;
        if (!this.pendingPointer) return;
        this.scrubTo(this.pendingPointer.y, this.pendingPointer.x);
      });
    }
  }

  touchEnd() {
    if (this.longPressTimer) { clearTimeout(this.longPressTimer); this.longPressTimer = null; }
    if (this.touchRaf) { cancelAnimationFrame(this.touchRaf); this.touchRaf = null; }
    if (this.touchMoved) {
      this.endScrub();
      this.fadeWave();
      this.hidePreview();
    }
    // снимаем запрет на обычный тап уже после того, как браузер отдаст click
    window.setTimeout(() => { this.suppressTap = false; }, 0);
  }

  /* ----------------------- подсказка при наведении ----------------------- */

  // Начало текста раздела: строки под заголовком до следующего заголовка.
  // Разметку убираем, чтобы в окошке был читаемый текст, а не символы.
  sectionExcerpt(hIdx) {
    const view = this.getView();
    const editor = view && view.editor;
    if (!editor) return '';

    const h = this.headings[hIdx];
    if (!h) return '';

    const startLine = h.position.start.line + 1;
    const nextLine = this.headings[hIdx + 1]
      ? this.headings[hIdx + 1].position.start.line
      : Math.min(startLine + 60, editor.lineCount ? editor.lineCount() : startLine + 60);

    const limit = Math.max(40, Number(this.p.previewChars) || 160);
    const parts = [];
    let total = 0;
    let inFence = false;

    for (let ln = startLine; ln < nextLine && total < limit; ln++) {
      const raw = editor.getLine(ln);
      if (raw === undefined || raw === null) break;
      const line = String(raw);

      // Блок кода и таблица в подсказке выглядят мусором: в первом случае
      // это синтаксис, во втором — палки и дефисы. Такие куски пропускаем,
      // и если больше ничего нет, в подсказке остаётся только заголовок.
      if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; continue; }
      if (inFence) continue;
      if (/^\s{4,}\S/.test(line)) continue;          // код с отступом
      if (/^\s*\|/.test(line)) continue;              // строка таблицы
      if (/^\s*[|:\- ]+$/.test(line) && line.includes('-')) continue;  // разделитель таблицы
      if (/^\s*(!\[|<)/.test(line)) continue;          // картинка или разметка

      const text = line
        .replace(/!?\[\[([^\]|]*)(?:\|([^\]]*))?\]\]/g, (m, a, b) => b || a)
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/^[>\s-]*[-*+]\s+/, '')
        .replace(/[*_`~=#]/g, '')
        .trim();
      if (!text) continue;

      parts.push(text);
      total += text.length;
    }

    const joined = parts.join(' ');
    return joined.length > limit ? joined.slice(0, limit).trimEnd() + '…' : joined;
  }

  showPreview(hIdx, anchorEl) {
    if (!this.p.hoverPreview || !this.hostEl) return;
    // при раскрытой структуре подсказка может быть не нужна или показываться
    // только над самой структурой — это отдельная настройка
    const mode = this.p.previewTrigger;
    if (mode === 'off') return;
    const fromBar = anchorEl && anchorEl.classList.contains('hr-row');
    const fromItem = anchorEl && anchorEl.classList.contains('hr-panel-item');
    if (mode === 'bars' && fromItem) return;
    if (mode === 'outline' && fromBar) return;

    const h = this.headings[hIdx];
    if (!h) return;

    if (!this.previewEl) {
      this.previewEl = this.hostEl.createDiv({ cls: 'hr-preview' });
    }
    this.previewEl.empty();
    this.previewEl.createDiv({ cls: 'hr-preview-title', text: h.heading });

    const body = this.sectionExcerpt(hIdx);
    if (body) this.previewEl.createDiv({ cls: 'hr-preview-body', text: body });

    this.previewEl.addClass('is-shown');
    this.positionPreview(anchorEl);
  }

  positionPreview(anchorEl) {
    if (!this.previewEl || !anchorEl || !this.hostEl) return;
    const hostRect = this.hostEl.getBoundingClientRect();
    const rect = anchorEl.getBoundingClientRect();

    const y = rect.top - hostRect.top + rect.height / 2;
    const maxY = hostRect.height - this.previewEl.offsetHeight / 2 - 8;
    this.previewEl.style.top = Math.max(8, Math.min(maxY, y)) + 'px';

    // Когда структура раскрыта, подсказка должна вставать сбоку от неё,
    // а не поверх — иначе она закрывает ровно то, что человек читает.
    const place = this.p.previewPlacement;
    const besideOutline = place === 'outline' ||
      (place === 'auto' && this.isPanelVisible() && this.sideEl);

    /* Отступ считаем числом, а не выражением для браузера: его надо знать,
       чтобы тут же ограничить ширину окошка остатком места. На телефоне
       полоски на пике длиннее рельса, отступ получался большим, и окошко
       уезжало за край экрана целиком — казалось, что настройка расстояния
       ни на что не влияет, хотя влияла, просто за пределами видимого. */
    const railW = parseFloat(this.hostEl.style.getPropertyValue('--hr-rail-w')) || 56;
    const room = parseFloat(this.hostEl.style.getPropertyValue('--hr-wave-room')) || 0;
    const extra = parseFloat(this.hostEl.style.getPropertyValue('--hr-preview-gap')) || 12;

    let offsetPx = railW + room + extra;
    if (besideOutline && this.sideEl) {
      const sideRect = this.sideEl.getBoundingClientRect();
      offsetPx = (this.p.side === 'left'
        ? sideRect.right - hostRect.left
        : hostRect.right - sideRect.left) + extra;
    }
    // окошку остаётся всё, что не занято рельсом, плюс небольшой зазор у края
    const room4text = Math.max(120, hostRect.width - offsetPx - 12);
    this.previewEl.style.maxWidth = Math.round(room4text) + 'px';
    const offset = Math.round(offsetPx) + 'px';

    if (this.p.side === 'left') {
      this.previewEl.style.left = offset;
      this.previewEl.style.right = 'auto';
    } else {
      this.previewEl.style.right = offset;
      this.previewEl.style.left = 'auto';
    }
  }

  hidePreview() {
    if (this.previewEl) this.previewEl.removeClass('is-shown');
  }

  // Всплывающие действия слева от пункта
  showItemMenu(idx) {
    if (!this.menuEl || !this.selected.size) return;
    this.menuIdx = idx;
    this.menuEl.empty();
    this.menuEl.removeClass('is-ghost');
    this.menuEl.style.removeProperty('width');
    this.menuEl.style.removeProperty('height');

    const copy = this.menuEl.createEl('button', { cls: 'hr-mi' });
    copy.setText(this.selected.size > 1 ? t('copyN', this.selected.size) : t('copy'));
    copy.addEventListener('click', (e) => {
      e.stopPropagation();
      this.holdOpen = true;
      this.ghostItemMenu();
      this.copySelected();
    });

    const del = this.menuEl.createEl('button', { cls: 'hr-mi hr-mi-danger' });
    del.setText(this.selected.size > 1 ? t('deleteN', this.selected.size) : t('delete'));
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      this.holdOpen = true;
      this.ghostItemMenu();
      this.deleteSelected(true);
    });

    const cancel = this.menuEl.createEl('button', { cls: 'hr-mi', text: t('cancel') });
    cancel.addEventListener('click', (e) => {
      e.stopPropagation();
      this.holdOpen = true;
      this.clearSelection();
      this.ghostItemMenu();
    });

    this.menuEl.addClass('is-shown');
    this.positionItemMenu();
  }

  positionItemMenu() {
    if (!this.menuEl || !this.menuEl.classList.contains('is-shown')) return;
    // На телефоне меню стоит полосой по низу блока: положение задаётся
    // стилями, а не кодом, иначе стилям пришлось бы перебивать эту строку
    if (this.isMobile) {
      this.menuEl.style.removeProperty('top');
      return;
    }
    const item = this.panelItems[this.menuIdx];
    const panel = this.panelEl;
    if (!item || !panel) { this.hideItemMenu(); return; }

    const pr = panel.getBoundingClientRect();
    const ir = item.getBoundingClientRect();

    // пункт мог уехать за пределы видимой части списка
    if (ir.bottom < pr.top || ir.top > pr.bottom) { this.hideItemMenu(); return; }

    const y = ir.top - pr.top + ir.height / 2;
    this.menuEl.style.top = Math.max(10, Math.min(pr.height - 10, y)) + 'px';
  }

  // После нажатия кнопка исчезает из-под курсора, и браузер справедливо решает,
  // что мышь ушла с виджета. Вместо вычислений координат оставляем на том же месте
  // невидимую заглушку того же размера: курсор по-прежнему над элементом плагина,
  // и уход засчитается только когда мышь действительно с неё сойдёт.
  ghostItemMenu() {
    if (!this.menuEl || !this.menuEl.classList.contains('is-shown')) return;
    const w = this.menuEl.offsetWidth;
    const h = this.menuEl.offsetHeight;
    this.menuEl.empty();
    this.menuEl.style.width = w + 'px';
    this.menuEl.style.height = h + 'px';
    this.menuEl.addClass('is-ghost');
  }

  hideItemMenu() {
    if (!this.menuEl) return;
    this.menuEl.removeClass('is-shown');
    this.menuEl.removeClass('is-ghost');
    this.menuEl.style.removeProperty('width');
    this.menuEl.style.removeProperty('height');
    this.menuIdx = null;
  }

  clearSelection() {
    this.selected.clear();
    this.anchorIdx = null;
    this.hideItemMenu();
    this.renderSelection();
  }

  setPanelHover(idx) {
    this.panelItems.forEach((it, i) => it.classList.toggle('is-hover', i === idx));
  }

  setRailHover(idx) {
    for (const stop of this.stops) {
      stop.el.classList.toggle('is-mirror', stop.kind === 'h' && stop.hIdx === idx);
    }
  }

  // Положения пунктов при прокрутке не меняются, поэтому замеряем их один раз.
  // Раньше бегунок на каждом кадре опрашивал все пункты, и на длинном списке
  // панель заметно отставала от курсора.
  // Кэш мог устареть: сменилась тема, шрифт или список пунктов.
  // Одна сверка вместо полного перезамера на каждом кадре.
  ensureMetrics() {
    const n = this.panelItems.length;
    if (!this.itemTop || this.itemTop.length !== n) { this.cacheItemMetrics(); return; }
    if (!n) return;
    if (this.panelItems[n - 1].offsetTop !== this.itemTop[n - 1]) this.cacheItemMetrics();
  }

  cacheItemMetrics() {
    this.itemTop = [];
    this.itemH = [];
    for (let i = 0; i < this.panelItems.length; i++) {
      this.itemTop.push(this.panelItems[i].offsetTop);
      this.itemH.push(this.panelItems[i].offsetHeight || 1);
    }
  }

  // Какому пункту структуры соответствует точка её прокрутки (дробно)
  fracAt(y) {
    const tops = this.itemTop;
    if (!tops || !tops.length) return 0;
    for (let i = 0; i < tops.length; i++) {
      const top = tops[i];
      const h = this.itemH[i];
      if (y < top) return i;
      if (y < top + h) return i + (y - top) / h;
    }
    return tops.length - 1;
  }

  // Положение на рельсе для дробного номера пункта
  railYAt(frac) {
    const last = this.panelItems.length - 1;
    const f = Math.max(0, Math.min(last, frac));
    const lo = Math.floor(f);
    const hi = Math.min(last, Math.ceil(f));
    const a = this.stopCenter(this.stopOfHeading(lo));
    const b = this.stopCenter(this.stopOfHeading(hi));
    return a + (b - a) * (f - lo);
  }

  // Видимая зона структуры, разложенная по столбцам: если она попадает
  // на границу, отрезок уходит вниз в одном столбце и появляется сверху в следующем
  updateMarker() {
    if (!this.markerEls || !this.panelListEl || !this.panelItems.length) return;
    const list = this.panelListEl;

    // при активном фильтре список не соответствует полоскам — бегунки прячем
    if (this.filterActive) {
      this.markerEls.forEach((m) => m.style.opacity = '0');
      return;
    }

    this.ensureMetrics();
    const fTop = this.fracAt(list.scrollTop);
    const fBottom = this.fracAt(list.scrollTop + list.clientHeight);

    for (let c = 0; c < this.markerEls.length; c++) {
      const m = this.markerEls[c];
      const inCol = this.stops.filter((st) => st.kind === 'h' && st.col === c);
      if (!inCol.length) { m.style.opacity = '0'; continue; }

      const a = inCol[0].hIdx;
      const b = inCol[inCol.length - 1].hIdx;
      const from = Math.max(fTop, a);
      const to = Math.min(fBottom, b);

      if (to < from) { m.style.opacity = '0'; continue; }

      const yTop = this.railYAt(from);
      const yBottom = this.railYAt(to);
      m.style.removeProperty('opacity');
      m.style.height = Math.max(MARKER_MIN_H, yBottom - yTop) + 'px';
      m.style.transform = 'translateY(' + yTop + 'px)';
    }
  }

  // Фильтрация списка структуры строкой поиска
  applyFilter(query) {
    const q = (query || '').trim().toLowerCase();
    this.filterActive = q.length > 0;

    this.panelItems.forEach((item, i) => {
      const hit = !this.filterActive || this.headings[i].heading.toLowerCase().includes(q);
      item.classList.toggle('hr-hidden', !hit);
    });

    this.cacheItemMetrics();
    this.updateEdges();
    this.updateMarker();
  }

  // Активное место вне видимой зоны структуры? Показать указатель у нужного края.
  updateEdges() {
    if (!this.edgeTop || !this.edgeBottom || !this.panelListEl) return;

    const visible = this.isPanelVisible();
    const item = this.panelItems[this.activeIndex];
    // при фильтре активного пункта может не быть в списке — указывать не на что
    if (this.filterActive || !visible || !item || item.classList.contains('hr-hidden')) {
      this.edgeTop.removeClass('is-shown');
      this.edgeBottom.removeClass('is-shown');
      return;
    }

    this.ensureMetrics();
    const list = this.panelListEl;
    const top = (this.itemTop && this.itemTop[this.activeIndex]) || 0;
    const bottom = top + ((this.itemH && this.itemH[this.activeIndex]) || 1);
    const viewTop = list.scrollTop;
    const viewBottom = viewTop + list.clientHeight;

    this.edgeTop.classList.toggle('is-shown', bottom <= viewTop + 1);
    this.edgeBottom.classList.toggle('is-shown', top >= viewBottom - 1);
  }

  // Раскрыть структуру, показав именно эту часть (ПКМ или Ctrl+клик по полоске)
  togglePanelAt(hIdx) {
    if (this.isOpen) {
      this.isOpen = false;
      this.applyPanelState();
      return;
    }
    this.isOpen = true;
    this.pendingCenterIdx = hIdx;
    this.applyPanelState();
  }

  applyPanelState() {
    if (!this.hostEl) return;
    const visible = this.isPanelVisible();
    const wasVisible = this.hostEl.classList.contains('hr-panel-visible');

    this.hostEl.classList.toggle('hr-panel-visible', visible);
    // в режиме удержания Ctrl набирать в поиске всё равно нельзя — прячем его
    this.hostEl.classList.toggle('hr-ctrl-peek', visible && !this.isOpen);

    /* Волна и раскрытая структура спорят за одно и то же место: полоска на
       пике длиннее рельса и ложится на список. Поэтому для двух состояний —
       структура закреплена и структура показана удержанием Ctrl — волна
       включается отдельными настройками, а когда она включена, список
       отъезжает вбок ровно на столько, сколько отбирают полоски. */
    const peek = visible && !this.isOpen;
    const waveAllowed = this.isOpen ? !!this.p.wavePinned
      : peek ? !!this.p.wavePeek
      : true;
    this.waveBlocked = !waveAllowed;
    this.hostEl.classList.toggle('hr-no-wave', !waveAllowed);
    this.hostEl.style.setProperty('--hr-panel-shift',
      (waveAllowed && visible ? this.panelShift() : 0) + 'px');
    if (!waveAllowed) this.resetWave();
    if (!visible) { this.setPanelHover(-1); this.setRailHover(-1); }

    document.querySelectorAll('.hr-action-btn').forEach((b) =>
      b.classList.toggle('is-active', this.isOpen)
    );

    if (visible && !wasVisible) {
      const idx = this.pendingCenterIdx !== null ? this.pendingCenterIdx : this.activeIndex;
      this.syncPanelTo(idx, true);
    }
    this.pendingCenterIdx = null;
    if (visible) window.setTimeout(() => { this.updateMarker(); this.updateEdges(); }, 20);
    else this.updateEdges();
  }

  // На сколько отодвинуть структуру, чтобы полоски на пике её не задевали
  panelShift() {
    const railW = parseFloat(this.hostEl.style.getPropertyValue('--hr-rail-w')) || 56;
    return Math.max(0, Math.round(this.peakBarWidth() - railW));
  }

  syncPanelTo(idx, force) {
    if (!this.isPanelVisible() || !this.panelListEl) return;
    if (!force && idx === this.lastSyncedIdx) return;
    this.lastSyncedIdx = idx;

    this.ensureMetrics();
    if (!this.itemTop || this.itemTop[idx] === undefined) return;

    const list = this.panelListEl;
    const target = this.itemTop[idx] - list.clientHeight / 2 + this.itemH[idx] / 2;
    const top = Math.max(0, Math.min(list.scrollHeight - list.clientHeight, target));
    this.panelScrollTo(top);
  }

  /* ------------------------------ клавиатура ------------------------------ */

  onKeyDown(e) {
    if (this.isMobile) return;
    if ((e.key === 'Control' || e.ctrlKey || e.metaKey) && !this.ctrlTemp) this.setCtrlTemp(true);

    // пробел работает как протяжка, но только пока курсор на виджете —
    // иначе он остаётся обычным пробелом в тексте
    // Стрелки: при наведении на рельс — только когда структура раскрыта
    // (иначе они перехватывались бы во время обычного набора текста).
    // С Ctrl — всегда, независимо от положения курсора.
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const byHover = this.overRail && this.isOpen;
      const byCtrl = e.ctrlKey || e.metaKey;
      if ((byHover || byCtrl) && this.headings.length) {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.key === 'ArrowDown' ? 1 : -1;
        const next = Math.max(0, Math.min(this.headings.length - 1, this.activeIndex + delta));
        this.animateScrollTo(this.stopOfHeading(next));
        return;
      }
    }

    // Delete удаляет выбранное — только при раскрытой структуре и курсоре на ней,
    // иначе клавиша перехватывалась бы во время обычного редактирования текста
    if ((e.key === 'Delete' || e.key === 'Backspace') &&
        this.isOpen && this.overRail && this.selected.size) {
      e.preventDefault();
      e.stopPropagation();
      this.deleteSelected();
      return;
    }
    if (e.key === 'Escape' && this.selected.size) {
      this.clearSelection();
      return;
    }

    if ((e.code === 'Space' || e.key === ' ') && this.overRail && !this.spaceHeld) {
      e.preventDefault();
      this.spaceHeld = true;
      if (this.pendingPointer) this.scrubTo(this.pendingPointer.y, this.pendingPointer.x);
    }
  }

  onKeyUp(e) {
    if (this.isMobile) return;
    if (e.key === 'Control' || e.key === 'Meta' || (!e.ctrlKey && !e.metaKey)) this.setCtrlTemp(false);
    if (e.code === 'Space' || e.key === ' ') {
      if (this.spaceHeld) { this.spaceHeld = false; this.endScrub(); }
    }
  }

  setCtrlTemp(val) {
    if (this.ctrlTemp === val) return;
    this.ctrlTemp = val;
    if (!val) this.holdOpen = false;
    this.applyPanelState();
  }

  /* --------------------- координаты заголовков --------------------- */

  // В режиме чтения список заголовков документа искался заново для каждого замера.
  // Держим его на время одной серии замеров.
  beginMeasure() {
    if (!this.scrollTarget) return;
    // геометрия контейнера одинакова для всей серии замеров — незачем
    // запрашивать её заново на каждый заголовок
    this.measureRect = this.scrollTarget.getBoundingClientRect();
    if (this.currentMode === 'preview') {
      this.buildPreviewTops();
    } else {
      const view = this.getView();
      const cm = view && view.editor && view.editor.cm;
      if (cm) {
        let docTop = cm.documentTop;
        if (typeof docTop !== 'number' && cm.contentDOM) {
          docTop = cm.contentDOM.getBoundingClientRect().top;
        }
        this.measureBase = docTop - this.measureRect.top + this.scrollTarget.scrollTop;
        this.measureCm = cm;
      }
    }
  }

  // В режиме чтения Obsidian держит в разметке только видимую часть документа,
  // поэтому отрисованные заголовки — лишь подмножество всех. Сопоставлять их
  // по порядковому номеру нельзя: третий отрисованный не равен третьему в файле.
  // Выстраиваем соответствие по уровню и тексту, а положения недостающих
  // достраиваем по номерам строк — по мере отрисовки они уточняются сами.
  buildPreviewTops() {
    const n = this.headings.length;
    const tops = new Array(n).fill(null);
    const els = this.scrollTarget.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const sTop = this.measureRect.top;
    const scrollTop = this.scrollTarget.scrollTop;

    // Приводим к общему виду: в отрисованном заголовке разметки уже нет,
    // а в исходном она есть — без этого ссылка или выделение в заголовке
    // ломали сравнение, и не совпадал вообще ни один заголовок.
    const norm = (v) => String(v || '')
      .replace(/!?\[\[([^\]|]*)(?:\|([^\]]*))?\]\]/g, (m, a, b) => b || a)
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`~=]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Obsidian кладёт исходный текст заголовка в атрибут — это надёжнее,
    // чем сравнивать видимый текст, и не зависит от разметки внутри
    const keyOf = (el) => {
      const raw = el.getAttribute ? el.getAttribute('data-heading') : null;
      return norm(raw === null || raw === undefined ? el.textContent : raw);
    };

    let hi = 0;
    for (const el of els) {
      const lvl = Number(el.tagName.slice(1));
      const text = keyOf(el);
      let j = hi;
      while (j < n && !(this.headings[j].level === lvl && norm(this.headings[j].heading) === text)) j++;
      if (j < n) {
        tops[j] = el.getBoundingClientRect().top - sTop + scrollTop;
        hi = j + 1;
      }
    }

    // опорные точки для достройки пропусков
    const known = [];
    for (let i = 0; i < n; i++) {
      if (tops[i] !== null) known.push({ i, line: this.headings[i].position.start.line, top: tops[i] });
    }

    if (!known.length && n) {
      // Ни один заголовок сопоставить не удалось. Раньше в этом случае
      // возвращались одни пустые значения и отслеживание переставало работать
      // совсем. Теперь раскладываем по номерам строк — приблизительно, но живо.
      const maxScroll = Math.max(1, this.scrollTarget.scrollHeight - this.scrollTarget.clientHeight);
      const lastLine = Math.max(1, this.headings[n - 1].position.start.line + 40);
      for (let i = 0; i < n; i++) {
        tops[i] = (this.headings[i].position.start.line / lastLine) * maxScroll;
      }
    }

    if (known.length) {
      const first = known[0];
      const last = known[known.length - 1];
      const perLine = (last.line > first.line)
        ? (last.top - first.top) / (last.line - first.line)
        : 24;

      for (let i = 0; i < n; i++) {
        if (tops[i] !== null) continue;
        const line = this.headings[i].position.start.line;
        let lo = null, up = null;
        for (const k of known) {
          if (k.i < i) lo = k;
          else if (k.i > i) { up = k; break; }
        }
        if (lo && up && up.line !== lo.line) {
          tops[i] = lo.top + (up.top - lo.top) * ((line - lo.line) / (up.line - lo.line));
        } else if (lo) {
          tops[i] = lo.top + (line - lo.line) * perLine;
        } else if (up) {
          tops[i] = up.top - (up.line - line) * perLine;
        }
      }
    }

    this.previewTops = tops;
  }

  endMeasure() {
    this.previewTops = null;
    this.measureRect = null;
    this.measureBase = null;
    this.measureCm = null;
  }

  headingTop(idx) {
    if (!this.scrollTarget) return null;

    const sRect = this.measureRect || this.scrollTarget.getBoundingClientRect();

    if (this.currentMode === 'preview') {
      if (!this.previewTops) this.buildPreviewTops();
      const v = this.previewTops ? this.previewTops[idx] : null;
      return (v === null || v === undefined) ? null : v;
    }

    let cm = this.measureCm;
    if (!cm) {
      const view = this.getView();
      cm = view && view.editor && view.editor.cm;
    }
    if (!cm) return null;

    const h = this.headings[idx];
    if (!h) return null;

    const lineNo = Math.min(h.position.start.line + 1, cm.state.doc.lines);
    const line = cm.state.doc.line(lineNo);
    const block = cm.lineBlockAt(line.from);

    let offsetBase = this.measureBase;
    if (offsetBase === null || offsetBase === undefined) {
      let docTopScreen = cm.documentTop;
      if (typeof docTopScreen !== 'number' && cm.contentDOM) {
        docTopScreen = cm.contentDOM.getBoundingClientRect().top;
      }
      offsetBase = docTopScreen - sRect.top + this.scrollTarget.scrollTop;
    }
    return block.top + offsetBase;
  }

  /* ------------------------------- прокрутка ------------------------------- */

  attachScroll(view) {
    const mode = typeof view.getMode === 'function' ? view.getMode() : 'source';
    this.currentMode = mode;

    let scroller = null;
    if (mode === 'preview') {
      scroller =
        view.containerEl.querySelector('.markdown-preview-view') ||
        view.containerEl.querySelector('.markdown-reading-view');
    } else if (view.editor && view.editor.cm && view.editor.cm.scrollDOM) {
      scroller = view.editor.cm.scrollDOM;
    }
    if (!scroller) return;

    this.scrollTarget = scroller;
    scroller.addEventListener('scroll', this.onScroll, { passive: true });

    // ручная прокрутка пользователем отменяет наш переход
    this.userInterrupt = () => { this.cancelAnim(); this.pinnedIdx = null; };
    scroller.addEventListener('wheel', this.userInterrupt, { passive: true });
    scroller.addEventListener('touchstart', this.userInterrupt, { passive: true });
    scroller.addEventListener('mousedown', this.userInterrupt, { passive: true });
  }

  detachScroll() {
    if (this.scrollTarget) {
      this.scrollTarget.removeEventListener('scroll', this.onScroll);
      if (this.userInterrupt) {
        this.scrollTarget.removeEventListener('wheel', this.userInterrupt);
        this.scrollTarget.removeEventListener('touchstart', this.userInterrupt);
        this.scrollTarget.removeEventListener('mousedown', this.userInterrupt);
      }
      this.scrollTarget = null;
    }
  }

  onScroll() {
    if (this.rafScroll) return;
    this.rafScroll = true;
    requestAnimationFrame(() => {
      this.rafScroll = false;
      this.updateActive();
      // Подсветка видимой области зависит от прокрутки, поэтому обновляется
      // каждый кадр; ореол у текущего заголовка — только при его смене.
      // ореол привязан к текущему заголовку, а не к прокрутке — он
      // обновляется при смене активного, здесь делать нечего
    });
  }

  // Подсвечиваем не один раздел, а всю видимую на экране область:
  // ярче всего там, где центр экрана, и мягко слабее к краям.
  /* Ореол вокруг текущего заголовка.

     Прежний режим «видимая область» убран: он зависел от геометрии редактора,
     на телефоне расходился с выделенной полоской и настраивался одним числом,
     которое ничего внятного не означало. Здесь всё то же, что у длин полосок:
     сколько полосок захвачено и какая яркость у каждой ступени. */
  paintGlow() {
    if (!this.stops.length) return;
    for (const stop of this.stops) {
      if (stop.kind === 'h') stop.bar.style.removeProperty('--hr-glow');
    }

    const mode = this.p.haloMode || 'always';
    if (mode === 'off') return;
    // на телефоне наведения нет, его роль играет касание рельса
    if (mode === 'hover' && !this.railHovered && !this.railTouch) return;

    const active = this.stopOfHeading(this.activeIndex);
    if (active === null || active === undefined || !this.stops[active]) return;

    const half = Math.max(0, Math.floor((this.haloSpan() - 1) / 2));
    if (!half) return;
    const col = this.stops[active].col;

    const inCol = [];
    for (let i = 0; i < this.stops.length; i++) {
      if (this.stops[i].kind === 'h' && this.stops[i].col === col) inCol.push(i);
    }
    const at = inCol.indexOf(active);
    if (at < 0) return;

    /* Центр ореола — там же, где метка. Когда метка едет, центр дробный, и
       ореол едет вместе с ней целиком, а не остаётся на прежнем месте, пока
       одна полоска путешествует. Ступени те же, что настроены у ореола. */
    const tr = this.travel;
    let center = at;
    if (tr && tr.pos !== null && (this.p.activeMove || 'travel') === 'travel') {
      const k = inCol.indexOf(Math.round(tr.pos));
      if (k >= 0) center = at + (tr.pos - Math.round(tr.pos)) + (k - at);
    }

    // с выключенной подсветкой текущей полоски в середине ореола
    // получалась дыра: соседи светятся, а центр — нет
    const fillCentre = (this.p.activeGlow || 'always') === 'off';

    for (let k = 0; k < inCol.length; k++) {
      const d = Math.abs(k - center);
      if (d > half + 1) continue;
      const v = d < 1
        ? (fillCentre ? this.haloStep(0) : this.haloStep(0) * Math.min(1, d))
        : this.stepBlend(d);
      if (v > 0.004) this.stops[inCol[k]].bar.style.setProperty('--hr-glow', v.toFixed(3));
    }
  }

  // Сколько полосок захватывает ореол: всегда нечётное, центральная одна
  haloSpan() {
    const raw = Math.max(1, Math.min(25, Math.round(numOr(this.p.haloSpan, 7))));
    return raw % 2 === 0 ? raw + 1 : raw;
  }

  // Яркость на дробном расстоянии: между ступенями значение переливается,
  // иначе едущий ореол дёргался бы от полоски к полоске
  stepBlend(d) {
    const half = Math.max(0, Math.floor((this.haloSpan() - 1) / 2));
    const lo = Math.floor(d);
    const frac = d - lo;
    const a = lo - 1 >= half ? 0 : this.haloStep(lo - 1);
    const b = lo >= half ? 0 : this.haloStep(lo);
    return a + (b - a) * smoothStep(frac);
  }

  // Яркость ступени ореола, доля от единицы
  haloStep(i) {
    const k = Math.max(0, Math.min(12, Math.round(i)));
    return Math.max(0, Math.min(100, numOr(this.p['haloS' + k], 0))) / 100;
  }

  /* Переезд выделения.

     Раньше выделенная полоска просто перекрашивалась в новом месте, и при
     переходе по структуре белая метка перескакивала через полэкрана рывком.
     Здесь между прежним и новым местом ведётся непрерывная величина: она
     доезжает пружиной со своим временем и проскоком, а по дороге за ней
     тянется затухающий след. Настройками это сводится обратно к мгновенному
     перескоку, если так больше нравится. */
  travelState() {
    if (!this.travel) this.travel = { pos: null, vel: 0, to: 0, raf: 0, last: 0 };
    return this.travel;
  }

  startTravel(fromIdx, toIdx) {
    const tr = this.travelState();
    tr.to = toIdx;
    if (tr.pos === null) { tr.pos = fromIdx === null ? toIdx : fromIdx; tr.vel = 0; }
    this.runTravel();
  }

  runTravel() {
    const tr = this.travelState();
    if (tr.raf) return;

    const tick = (now) => {
      tr.raf = 0;
      if (!this.stops.length) { tr.pos = null; return; }

      const dt = Math.min(0.05, tr.last ? (now - tr.last) / 1000 : 1 / 60);
      tr.last = now;

      const ms = Math.max(0, numOr(this.p.activeTravelTime, 510));
      if (ms < 8) { tr.pos = tr.to; tr.vel = 0; }
      else {
        const over = Math.max(0, Math.min(100, numOr(this.p.activeOvershoot, 50))) / 100;
        const omega = 4 / (ms / 1000);
        const zeta = 1 - over * 0.86;
        const steps = Math.max(1, Math.min(8, Math.ceil((omega * dt) / 0.25)));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          tr.vel += (omega * omega * (tr.to - tr.pos) - 2 * zeta * omega * tr.vel) * h;
          tr.pos += tr.vel * h;
        }
      }

      this.paintTravel();

      if (Math.abs(tr.to - tr.pos) < 0.02 && Math.abs(tr.vel) < 0.05) {
        tr.pos = tr.to; tr.vel = 0; tr.last = 0;
        this.paintTravel();
        return;
      }
      tr.raf = requestAnimationFrame(tick);
    };
    tr.raf = requestAnimationFrame(tick);
  }

  // Пока метка едет, за ней едет и весь ореол: подсветка пересобирается
  // от дробного положения метки, по тем же ступеням, что настроены у ореола
  paintTravel() {
    const tr = this.travelState();
    if (tr.pos === null) return;
    this.paintGlow();

    const trail = Math.max(0, Math.min(100, numOr(this.p.activeTrail, 100))) / 100;
    const arrived = Math.abs(tr.to - tr.pos) < 0.02;

    for (let i = 0; i < this.stops.length; i++) {
      const stop = this.stops[i];
      if (stop.kind !== 'h') continue;
      const d = Math.abs(i - tr.pos);
      const near = d >= 1 ? 0 : 1 - d;
      // в пути метка приглушена настройкой следа, на месте — горит полностью
      const v = near * (arrived && i === tr.to ? 1 : trail);
      if (v > 0.01) stop.el.style.setProperty('--hr-travel', v.toFixed(3));
      else stop.el.style.removeProperty('--hr-travel');
    }
  }

  stopTravel() {
    const tr = this.travelState();
    if (tr.raf) { cancelAnimationFrame(tr.raf); tr.raf = 0; }
    tr.pos = null; tr.vel = 0; tr.last = 0;
    for (const stop of this.stops) {
      if (stop.kind === 'h') stop.el.style.removeProperty('--hr-travel');
    }
  }

  setActive(idx) {
    // Раньше при каждом кадре прокрутки перебирались все полоски и все пункты
    // структуры, даже когда активный блок не менялся: на длинной заметке это
    // сотни обращений к разметке в секунду впустую.
    if (idx === this.activeIndex && this.activeApplied) return;
    const prevStop = this.stopOfHeading(this.activeIndex);
    this.activeIndex = idx;
    this.activeApplied = true;

    const nextStop = this.stopOfHeading(idx);
    if ((this.p.activeMove || 'travel') === 'travel' && this.stops.length) {
      this.startTravel(prevStop === null || prevStop === undefined ? null : prevStop, nextStop);
    } else {
      this.stopTravel();
    }

    if (this.prevActiveEls) {
      this.prevActiveEls.forEach((el) => el.classList.remove('is-active', 'hr-no-active-paint'));
    }
    const nowActive = [];
    const st = this.stops[this.stopOfHeading(idx)];
    if (st && st.kind === 'h') nowActive.push(st.el);
    if (this.panelItems[idx]) nowActive.push(this.panelItems[idx]);
    // Настройка «Подсвечивать текущую полоску» раньше ни на что не влияла:
    // класс ставился всегда, а цвет задавали стили.
    const glowActive = (this.p.activeGlow || 'always') !== 'off';
    nowActive.forEach((el) => {
      el.classList.add('is-active');
      el.classList.toggle('hr-no-active-paint', !glowActive);
    });
    this.prevActiveEls = nowActive;

    this.paintGlow();
    this.updateEdges();
  }

  updateActive() {
    if (!this.railEl || !this.headings.length || !this.scrollTarget) return;
    if (this.animId || this.dragging || this.spaceHeld || this.scrubRaf) return;

    if (this.pinnedIdx !== null) {
      const target = this.targetScrollFor(this.stopOfHeading(this.pinnedIdx));
      if (target !== null && Math.abs(this.scrollTarget.scrollTop - target) < 8) {
        this.setActive(this.pinnedIdx);
        return;
      }
      this.pinnedIdx = null;
    }

    let idx = 0;
    try {
      const edge = this.scrollTarget.scrollTop + this.scrollTarget.clientHeight * CENTER_RATIO;
      // заголовки идут по возрастанию, поэтому ищем делением пополам:
      // на длинных заметках это единицы замеров вместо сотен на каждый кадр
      this.beginMeasure();
      let lo = 0, hi = this.headings.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const top = this.headingTop(mid);
        if (top === null) break;
        if (top <= edge) { idx = mid; lo = mid + 1; }
        else hi = mid - 1;
      }
      this.endMeasure();
    } catch (e) {
      this.endMeasure();
      return;
    }

    this.setActive(idx);
    // структура следует за документом: пока курсор не на виджете,
    // текущий раздел подводится к центру списка
    if (!this.overRail) this.syncPanelTo(idx);
  }
}

/* Окно «поделиться своим набором».

   Плагин ничего не отправляет сам и никуда не ходит по сети. Он показывает
   набор текстом, кладёт его в буфер обмена и открывает почтовый клиент с
   заполненным письмом. Отправлять или нет — решает человек; отменить можно
   на любом шаге, просто закрыв окно. */
class HeadingRailShareModal extends Modal {
  constructor(app, plugin, profile) {
    super(app);
    this.plugin = plugin;
    this.which = profile === 'mobile' ? 'mobile' : 'desktop';
    this.styleName = '';
  }

  payload() {
    const s = this.plugin.settings;
    const body = { plugin: 'heading-rail', version: HR_VERSION };
    if (this.styleName) body.name = this.styleName;
    // Обе версии подписаны явно: раньше в письме было просто «settings»,
    // и понять, от компьютера он или от телефона, было нельзя.
    if (this.which === 'both') {
      body.desktop = s.desktop;
      body.mobile = s.mobile;
    } else {
      body.profile = this.which;
      body[this.which] = s[this.which];
    }
    return JSON.stringify(body, null, 2);
  }

  render() {
    this.box.value = this.payload();
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h3', { text: t('shareTitle') });
    contentEl.createEl('p', { cls: 'hr-settings-hint', text: t('shareIntro') });

    new Setting(contentEl)
      .setName(t('shareNameName'))
      .setDesc(t('shareNameDesc'))
      .addText((tx) => tx
        .setPlaceholder(t('shareNamePlaceholder'))
        .onChange((v) => { this.styleName = v.trim(); this.render(); }));

    new Setting(contentEl)
      .setName(t('shareWhichName'))
      .setDesc(t('shareWhichDesc'))
      .addDropdown((d) => d
        .addOption('desktop', t('profileDesktop'))
        .addOption('mobile', t('profileMobile'))
        .addOption('both', t('shareBoth'))
        .setValue(this.which)
        .onChange((v) => { this.which = v; this.render(); }));

    this.box = contentEl.createEl('textarea', { cls: 'hr-share-box' });
    this.box.readOnly = true;
    this.render();

    const row = contentEl.createDiv({ cls: 'hr-share-actions' });

    const copyBtn = row.createEl('button', { cls: 'mod-cta', text: t('shareCopy') });
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(this.payload());
        new Notice(t('shareCopied'));
      } catch (e) {
        this.box.select();
        new Notice(t('shareCopyManual'));
      }
    });

    const mailBtn = row.createEl('button', { text: t('shareMail') });
    mailBtn.addEventListener('click', () => {
      const subject = encodeURIComponent(t('shareSubject') + (this.styleName ? ' — ' + this.styleName : ''));
      window.open('mailto:' + AUTHOR_EMAIL +
        '?subject=' + subject + '&body=' + encodeURIComponent(t('shareBody')));
    });

    contentEl.createEl('p', { cls: 'hr-settings-hint', text: t('shareNote') });
  }

  onClose() { this.contentEl.empty(); }
}

class HeadingRailTrashModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    this.render();
  }

  render() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('hr-trash-modal');
    contentEl.createEl('h3', { text: t('historyTitle') });

    this.plugin.pruneTrash();
    const del = this.plugin.undoStack;
    const cop = this.plugin.copyStack;

    // Оба раздела показываются всегда: пустой пишет об этом сам,
    // чтобы блоки не исчезали и место не «прыгало»
    contentEl.createEl('h4', { cls: 'hr-trash-head', text: t('trashCopiedHead') });
    if (!cop.length) {
      contentEl.createEl('p', { cls: 'hr-trash-empty', text: t('trashCopiedEmpty') });
    } else {
      for (let i = cop.length - 1; i >= 0; i--) {
        const row = this.makeRow(contentEl, cop[i]);

        const btn = row.createEl('button', { cls: 'hr-btn', text: t('copyAgain') });
        btn.addEventListener('click', () => this.plugin.copyAgain(i));

        const drop = row.createEl('button', { cls: 'hr-btn', text: t('forget') });
        drop.addEventListener('click', () => {
          this.plugin.copyStack.splice(i, 1);
          this.render();
        });
      }
    }

    contentEl.createEl('h4', { cls: 'hr-trash-head', text: t('trashDeletedHead') });
    if (!del.length) {
      contentEl.createEl('p', { cls: 'hr-trash-empty', text: t('trashDeletedEmpty') });
    } else {
      contentEl.createEl('p', { cls: 'hr-trash-hint', text: t('trashHint') });
      for (let i = del.length - 1; i >= 0; i--) {
        const row = this.makeRow(contentEl, del[i]);

        const btn = row.createEl('button', { cls: 'hr-btn', text: t('restore') });
        btn.addEventListener('click', async () => {
          const ok = await this.plugin.restoreAt(i);
          if (ok) this.render();
        });

        const drop = row.createEl('button', { cls: 'hr-btn', text: t('forget') });
        drop.addEventListener('click', () => {
          this.plugin.undoStack.splice(i, 1);
          this.render();
        });
      }
    }
  }

  makeRow(parent, e) {
    const row = parent.createDiv({ cls: 'hr-trash-row' });
    const info = row.createDiv({ cls: 'hr-trash-info' });
    info.createDiv({ cls: 'hr-trash-title', text: e.titles.join(', ') || t('trashNoTitle') });

    const when = new Date(e.time);
    const whenStr = when.toLocaleDateString() + ' ' +
      when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    info.createDiv({ cls: 'hr-trash-meta', text: t('trashMeta', e.lines, e.path, whenStr) });
    return row;
  }

  onClose() {
    this.contentEl.empty();
  }
}

class HeadingRailSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.tab = 'desktop';   // какой профиль сейчас правим
    this.openGroups = {};   // какие разделы раскрыты: экран перерисовывается часто
  }

  // Сворачиваемый раздел. Настроек стало много, и без этого экран
  // превращается в полотно, по которому надо долго листать.
  // Раскрытые разделы запоминаются: переключение любого выключателя
  // перерисовывает экран целиком, и иначе всё схлопывалось бы обратно.
  group(containerEl, title, key, openByDefault) {
    const known = this.openGroups[key];
    const box = containerEl.createEl('details', { cls: 'hr-settings-group' });
    box.open = known === undefined ? !!openByDefault : known;
    box.createEl('summary', { cls: 'hr-settings-summary', text: title });
    box.addEventListener('toggle', () => { this.openGroups[key] = box.open; });
    return box.createDiv({ cls: 'hr-settings-body' });
  }

  /* Настоящий цвет темы для палитры. Пустой цвет в настройке означает «как у
     темы», и палитра должна показывать именно его. Раньше в ней стоял
     выдуманный сиреневый: на экране настроек сиреневый, а на деле белый
     или чёрный, в зависимости от темы. */
  themeHex(cssVar) {
    try {
      const probe = document.createElement('div');
      probe.style.color = 'var(' + cssVar + ')';
      probe.style.display = 'none';
      document.body.appendChild(probe);
      const rgb = getComputedStyle(probe).color;
      probe.remove();
      const m = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(rgb || '');
      if (!m) return '#888888';
      const h = (n) => Number(n).toString(16).padStart(2, '0');
      return '#' + h(m[1]) + h(m[2]) + h(m[3]);
    } catch (e) {
      return '#888888';
    }
  }

  // Захват ореола: то же правило, что и у формы волны
  haloSpanValue() {
    const raw = Math.max(1, Math.min(25, Math.round(numOr(this.val('haloSpan'), 7))));
    return raw % 2 === 0 ? raw + 1 : raw;
  }

  // Захват в режиме ступеней всегда нечётный: одна полоска в центре
  spanValue() {
    const raw = Math.max(1, Math.min(25, Math.round(numOr(this.val('waveSpan'), 9))));
    return raw % 2 === 0 ? raw + 1 : raw;
  }

  // Длина ступени; если её ни разу не трогали, берём разумную
  stepValue(d) {
    const v = numOr(this.val('stepW' + d), null);
    if (v !== null) return v;
    return Math.max(4, 68 - d * 10);
  }

  /* Набор накладывается поверх текущего профиля: перечисленные в нём значения
     заменяются, всё остальное остаётся как было. Пустой набор возвращает
     значения по умолчанию — это и есть «Как из коробки». */
  // Название набора по его имени в списке
  presetName(id) {
    const pr = STYLE_PRESETS.find((x) => x.id === id);
    return pr ? pr.name : 'presetBase';
  }

  // Отличается ли текущий профиль от набора, который в нём записан
  presetTouched() {
    const pr = STYLE_PRESETS.find((x) => x.id === (this.plugin.settings.activePreset || 'base'));
    const base = pr && pr.settings
      ? pr.settings
      : (this.tab === 'mobile' ? DEFAULT_SETTINGS.mobile : PROFILE_DEFAULTS);
    const now = this.plugin.settings[this.tab];
    return Object.keys(base).some((k) => k in PROFILE_DEFAULTS && now[k] !== base[k]);
  }

  async applyPreset(pr) {
    const target = this.plugin.settings[this.tab];
    if (!pr.settings) {
      for (const key of Object.keys(PROFILE_DEFAULTS)) {
        const base = this.tab === 'mobile' ? DEFAULT_SETTINGS.mobile : PROFILE_DEFAULTS;
        target[key] = base[key];
      }
    } else {
      for (const key of Object.keys(pr.settings)) {
        if (key in PROFILE_DEFAULTS) target[key] = pr.settings[key];
      }
    }
    // какие цвета пришли из набора — только их потом можно подстраивать под тему
    const all = this.plugin.settings.themedColors || (this.plugin.settings.themedColors = {});
    all[this.tab] = {};
    if (pr.settings) {
      for (const key of COLOR_KEYS) {
        if (pr.settings[key]) all[this.tab][key] = true;
      }
    }

    this.plugin.settings.activePreset = pr.id;
    await this.apply();
    new Notice(t('presetApplied', t(pr.name)));
    this.redraw();
  }

  save() {
    return this.plugin.saveData(this.plugin.settings);
  }

  /* Пока ползунок тянут, значение меняется десятки раз в секунду, и на каждое
     изменение рельс собирался заново. Это и тормозило, и дёргало экран.
     Теперь настройка применяется сразу, а тяжёлая перестройка — один раз,
     когда ползунок отпустили. */
  async apply() {
    await this.save();
    if (this.applyTimer) window.clearTimeout(this.applyTimer);
    this.applyTimer = window.setTimeout(() => {
      this.applyTimer = null;
      this.plugin.refresh(true);
    }, 90);
  }

  // Контейнер, внутри которого экран настроек прокручивается
  scroller() {
    let el = this.containerEl;
    while (el) {
      if (el.scrollHeight - el.clientHeight > 4) return el;
      el = el.parentElement;
    }
    return null;
  }

  /* Перерисовка экрана настроек собирает разметку заново, и прокрутка
     улетает к началу — при длинном списке это выбрасывает из того места,
     где человек работал. Запоминаем положение и возвращаем его. */
  redraw() {
    const box = this.scroller();
    const top = box ? box.scrollTop : 0;
    this.display();
    if (box) {
      box.scrollTop = top;
      // после перерисовки высота могла измениться — поправляем ещё раз
      window.requestAnimationFrame(() => { box.scrollTop = top; });
    }
  }

  // Значение профиля, который сейчас редактируется
  val(key) {
    return this.plugin.settings[this.tab][key];
  }

  async setVal(key, v) {
    this.plugin.settings[this.tab][key] = v;
    // цвет, выставленный руками, — закон: снимаем его с подстройки под тему
    if (COLOR_KEYS.includes(key)) {
      const all = this.plugin.settings.themedColors || (this.plugin.settings.themedColors = {});
      if (all[this.tab]) delete all[this.tab][key];
    }
    await this.apply();
  }

  linked(key) {
    return !!(this.plugin.settings.mobileLinked || {})[key];
  }

  // Строка настройки с кнопкой привязки к компьютеру (только в профиле телефона)
  /* Строка настройки. На вкладке телефона у каждой строки появляется кнопка
     со звеном цепи: нажатая — настройка берёт значение с компьютера и дальше
     меняется вместе с ним, отжатая — у телефона своё значение. Раньше об этом
     говорила только подсказка кнопки, и было непонятно, почему строка вдруг
     посерела; теперь это сказано словами прямо в описании настройки. */
  row(containerEl, key) {
    const setting = new Setting(containerEl);
    if (this.tab !== 'mobile') return setting;

    const linked = this.linked(key);
    setting.addExtraButton((b) => b
      .setIcon(linked ? 'link' : 'unlink')
      .setTooltip(linked ? t('unlinkFromDesktop') : t('linkToDesktop'))
      .onClick(async () => {
        const map = this.plugin.settings.mobileLinked || (this.plugin.settings.mobileLinked = {});
        map[key] = !map[key];
        await this.apply();
        this.redraw();
      }));

    if (linked) {
      setting.setClass('hr-setting-linked');
      setting.setDesc(t('linkedNote'));
      // описание ставится позже по цепочке — дописываем пояснение к нему
      const orig = setting.setDesc.bind(setting);
      setting.setDesc = (text) => orig((text ? text + ' ' : '') + t('linkedNote'));
    }
    return setting;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    /* ---------------- общее ---------------- */

    new Setting(containerEl)
      .setName(t('settingLanguageName'))
      .setDesc(t('settingLanguageDesc'))
      .addDropdown((d) => {
        d.addOption('auto', t('optLanguageAuto'));
        for (const code of Object.keys(LOCALES)) d.addOption(code, LANGUAGE_NAMES[code] || code);
        d.setValue(this.plugin.settings.language)
          .onChange(async (v) => {
            this.plugin.settings.language = v;
            setLocale(v);
            await this.apply();
            this.display();
          });
      });

    /* ---------------- готовые наборы ---------------- */

    const gStyles = this.group(containerEl, t('settingsSectionPresets'), 'presets', true);
    gStyles.createEl('p', { cls: 'hr-settings-hint', text: t('presetsHint') });

    /* Набор, который стоит сейчас. Base включён с самого начала — отдельно
       применять его не надо, — а как только человек что-то подкрутил, рядом
       с названием так и написано: набор изменён. */
    const current = this.plugin.settings.activePreset || 'base';
    const touched = this.presetTouched();
    let chosen = this.pendingPreset || current;

    new Setting(gStyles)
      .setName(t('settingPresetName'))
      .setDesc(t('settingPresetDesc') + ' ' +
        (touched ? t('presetStateChanged', t(this.presetName(current)))
                 : t('presetStateOn', t(this.presetName(current)))))
      .addDropdown((d) => {
        for (const pr of STYLE_PRESETS) d.addOption(pr.id, t(pr.name));
        d.setValue(chosen).onChange((v) => { chosen = v; this.pendingPreset = v; });
      })
      .addButton((b) => b
        .setButtonText(touched ? t('presetRestore') : t('presetApply'))
        .setCta()
        .onClick(async () => {
          const pr = STYLE_PRESETS.find((x) => x.id === chosen);
          if (pr) this.applyPreset(pr);
        }));

    new Setting(gStyles)
      .setName(t('settingFollowThemeName'))
      .setDesc(t('settingFollowThemeDesc'))
      .addToggle((tg) => tg
        .setValue(this.plugin.settings.followTheme !== false)
        .onChange(async (v) => { this.plugin.settings.followTheme = v; await this.apply(); }));

    new Setting(gStyles)
      .setName(t('settingShareName'))
      .setDesc(t('settingShareDesc'))
      .addButton((b) => b
        .setButtonText(t('shareOpen'))
        .onClick(() => {
          new HeadingRailShareModal(this.app, this.plugin, this.tab).open();
        }));

    /* ---------------- переключатель профиля ---------------- */

    const tabs = containerEl.createDiv({ cls: 'hr-settings-tabs' });
    const mkTab = (id, label) => {
      const b = tabs.createEl('button', { cls: 'hr-settings-tab', text: label });
      if (this.tab === id) b.addClass('is-active');
      b.addEventListener('click', () => { this.tab = id; this.redraw(); });
    };
    mkTab('desktop', t('profileDesktop'));
    mkTab('mobile', t('profileMobile'));

    if (this.tab === 'mobile') {
      containerEl.createEl('p', { cls: 'hr-settings-hint', text: t('mobileProfileHint') });
    }

    if (this.tab === 'mobile') {
      new Setting(containerEl)
        .setName(t('settingMobileOnName'))
        .setDesc(t('settingMobileOnDesc'))
        .addToggle((tg) => tg
          .setValue(this.plugin.settings.mobileEnabled !== false)
          .onChange(async (v) => {
            this.plugin.settings.mobileEnabled = v;
            await this.apply();
            this.redraw();
          }));
      if (this.plugin.settings.mobileEnabled === false) {
        containerEl.createEl('p', { cls: 'hr-settings-hint', text: t('mobileOffHint') });
        return;
      }
    }

    /* ---------------- расположение ---------------- */

    const gLayout = this.group(containerEl, t('settingsSectionLayout'), 'layout', true);

    this.row(gLayout, 'side')
      .setName(t('settingSideName'))
      .setDesc(t('settingSideDesc'))
      .addDropdown((d) => d
        .addOption('right', t('optRight'))
        .addOption('left', t('optLeft'))
        .setValue(this.val('side'))
        .onChange((v) => this.setVal('side', v)));

    this.row(gLayout, 'anchor')
      .setName(t('settingAnchorName'))
      .setDesc(t('settingAnchorDesc'))
      .addDropdown((d) => d
        .addOption('center', t('optAnchorCenter'))
        .addOption('top', t('optAnchorTop'))
        .addOption('bottom', t('optAnchorBottom'))
        .setValue(this.val('anchor'))
        .onChange((v) => this.setVal('anchor', v)));

    this.row(gLayout, 'spacingMode')
      .setName(t('settingSpacingName'))
      .setDesc(t('settingSpacingDesc'))
      .addDropdown((d) => d
        .addOption('adaptive', t('optAdaptive'))
        .addOption('fixed', t('optFixed'))
        .setValue(this.val('spacingMode'))
        .onChange(async (v) => { await this.setVal('spacingMode', v); this.redraw(); }));

    if (this.val('spacingMode') === 'fixed') {
      this.row(gLayout, 'fixedSpacing')
        .setName(t('settingFixedSpacingName'))
        .setDesc(t('settingFixedSpacingDesc'))
        .addSlider((sl) => sl.setLimits(2, 40, 1).setDynamicTooltip()
          .setValue(numOr(this.val('fixedSpacing'), 9))
          .onChange((v) => this.setVal('fixedSpacing', v)));
    } else {
      this.row(gLayout, 'spacingMin')
        .setName(t('settingSpacingMinName'))
        .setDesc(t('settingSpacingMinDesc'))
        .addSlider((sl) => sl.setLimits(2, 30, 1).setDynamicTooltip()
          .setValue(numOr(this.val('spacingMin'), 7))
          .onChange((v) => this.setVal('spacingMin', v)));

      this.row(gLayout, 'spacingMax')
        .setName(t('settingSpacingMaxName'))
        .setDesc(t('settingSpacingMaxDesc'))
        .addSlider((sl) => sl.setLimits(4, 60, 1).setDynamicTooltip()
          .setValue(numOr(this.val('spacingMax'), 15))
          .onChange((v) => this.setVal('spacingMax', v)));
    }

    this.row(gLayout, 'railFrom')
      .setName(t('settingRailFromName'))
      .setDesc(t('settingRailFromDesc'))
      .addSlider((sl) => sl.setLimits(0, 45, 1).setDynamicTooltip()
        .setValue(numOr(this.val('railFrom'), 4))
        .onChange((v) => this.setVal('railFrom', v)));

    this.row(gLayout, 'railTo')
      .setName(t('settingRailToName'))
      .setDesc(t('settingRailToDesc'))
      .addSlider((sl) => sl.setLimits(55, 100, 1).setDynamicTooltip()
        .setValue(numOr(this.val('railTo'), 95))
        .onChange((v) => this.setVal('railTo', v)));

    this.row(gLayout, 'railEdge')
      .setName(t('settingRailEdgeName'))
      .setDesc(t('settingRailEdgeDesc'))
      .addSlider((sl) => sl.setLimits(0, 120, 2).setDynamicTooltip()
        .setValue(numOr(this.val('railEdge'), 0))
        .onChange((v) => this.setVal('railEdge', v)));

    this.row(gLayout, 'panelGap')
      .setName(t('settingPanelGapName'))
      .setDesc(t('settingPanelGapDesc'))
      .addSlider((sl) => sl.setLimits(0, 120, 2).setDynamicTooltip()
        .setValue(numOr(this.val('panelGap'), 30))
        .onChange((v) => this.setVal('panelGap', v)));

    this.row(gLayout, 'uiRadius')
      .setName(t('settingRadiusName'))
      .setDesc(t('settingRadiusDesc'))
      .addSlider((sl) => sl.setLimits(0, 40, 1).setDynamicTooltip()
        .setValue(numOr(this.val('uiRadius'), 16))
        .onChange((v) => this.setVal('uiRadius', v)));

    this.row(gLayout, 'colGap')
      .setName(t('settingColGapName'))
      .setDesc(t('settingColGapDesc'))
      .addSlider((sl) => sl.setLimits(0, 60, 1).setDynamicTooltip()
        .setValue(numOr(this.val('colGap'), 10))
        .onChange((v) => this.setVal('colGap', v)));

    // наведения на телефоне нет — настройке там нечего делать
    this.row(gLayout, 'scrollTo')
      .setName(t('settingScrollToName'))
      .setDesc(t('settingScrollToDesc'))
      .addDropdown((d) => d
        .addOption('top', t('optScrollTop'))
        .addOption('upper', t('optScrollUpper'))
        .addOption('center', t('optScrollCenter'))
        .setValue(this.val('scrollTo') || 'top')
        .onChange((v) => this.setVal('scrollTo', v)));

    if (this.tab !== 'mobile') {
      this.row(gLayout, 'hoverScrolls')
        .setName(t('settingHoverScrollName'))
        .setDesc(t('settingHoverScrollDesc'))
        .addToggle((tg) => tg
          .setValue(this.val('hoverScrolls'))
          .onChange((v) => this.setVal('hoverScrolls', v)));
    }

    /* ---------------- волна ----------------

       Наверху шесть ползунков, которыми волна задаётся целиком.
       Всё остальное — в свёрнутой тонкой настройке ниже. */

    const gWave = this.group(containerEl, t('settingsSectionWave'), 'wave', true);

    gWave.createEl('p', { cls: 'hr-settings-hint', text: t('waveIntro') });

    this.row(gWave, 'waveIntensity')
      .setName(t('settingIntensityName'))
      .setDesc(t('settingIntensityDesc'))
      .addSlider((sl) => sl.setLimits(0, 200, 5).setDynamicTooltip()
        .setValue(numOr(this.val('waveIntensity'), 100))
        .onChange((v) => this.setVal('waveIntensity', v)));

    this.row(gWave, 'peakMode')
      .setName(t('settingPeakModeName'))
      .setDesc(t('settingPeakModeDesc'))
      .addDropdown((d) => d
        .addOption('target', t('optPeakTarget'))
        .addOption('add', t('optPeakAdd'))
        .setValue(this.val('peakMode') || 'target')
        .onChange(async (v) => { await this.setVal('peakMode', v); this.redraw(); }));

    if ((this.val('peakMode') || 'target') === 'add') {
      this.row(gWave, 'peakAdd')
        .setName(t('settingPeakAddName'))
        .setDesc(t('settingPeakAddDesc'))
        .addSlider((sl) => sl.setLimits(0, 300, 2).setDynamicTooltip()
          .setValue(numOr(this.val('peakAdd'), 48))
          .onChange((v) => this.setVal('peakAdd', v)));
    } else {
      this.row(gWave, 'peakLength')
        .setName(t('settingPeakLengthName'))
        .setDesc(t('settingPeakLengthDesc'))
        .addSlider((sl) => sl.setLimits(8, 300, 2).setDynamicTooltip()
          .setValue(numOr(this.val('peakLength'), 68))
          .onChange((v) => this.setVal('peakLength', v)));
    }

    this.row(gWave, 'waveCurve')
      .setName(t('settingCurveName'))
      .setDesc(t('settingCurveDesc'))
      .addDropdown((d) => d
        .addOption('bell', t('optCurveBell'))
        .addOption('peak', t('optCurvePeak'))
        .addOption('plateau', t('optCurvePlateau'))
        .addOption('cosine', t('optCurveCosine'))
        .addOption('wedge', t('optCurveWedge'))
        .addOption('step', t('optCurveStep'))
        .addOption('ripple', t('optCurveRipple'))
        .addOption('custom', t('optCurveCustom'))
        .setValue(this.val('waveCurve') || 'bell')
        .onChange(async (v) => { await this.setVal('waveCurve', v); this.redraw(); }));

    if ((this.val('waveCurve') || 'bell') === 'custom') {
      // Своя форма: наибольшая длина для каждого расстояния, в пикселях.
      // Число ступеней всегда нечётное — одна в центре, поровну по бокам.
      const span = this.spanValue();
      this.row(gWave, 'waveSpan')
        .setName(t('settingSpanName'))
        .setDesc(t('settingSpanDesc', span, (span - 1) / 2))
        .addSlider((sl) => sl.setLimits(1, 25, 2).setDynamicTooltip()
          .setValue(span)
          .onChange(async (v) => { await this.setVal('waveSpan', v); this.redraw(); }));

      const gSteps = this.group(gWave, t('settingsSectionSteps'), 'steps', true);
      gSteps.createEl('p', { cls: 'hr-settings-hint', text: t('stepsHint') });

      const half = (span - 1) / 2;
      for (let d = 0; d <= half; d++) {
        const key = 'stepW' + d;
        this.row(gSteps, key)
          .setName(d === 0 ? t('settingStepCenterName') : t('settingStepName', d))
          .addSlider((sl) => sl.setLimits(2, 300, 1).setDynamicTooltip()
            .setValue(Math.round(this.stepValue(d)))
            .onChange((v) => this.setVal(key, v)));
      }
    } else {
      this.row(gWave, 'waveReach')
        .setName(t('settingReachName'))
        .setDesc(t('settingReachDesc'))
        .addSlider((sl) => sl.setLimits(3, 120, 1).setDynamicTooltip()
          .setValue(Math.round(numOr(this.val('waveReach'), 2.5) * 10))
          .onChange((v) => this.setVal('waveReach', v / 10)));
    }

    /* Дальше идёт то, что имеет смысл только при курсоре. На телефоне волна
       живёт ровно столько, сколько палец лежит на рельсе, и он в этот момент
       закрывает собой то место, где разница была бы видна. Поэтому на вкладке
       телефона этих настроек нет: они бы только путали. */
    if (this.tab !== 'mobile') {
      this.row(gWave, 'centerMode')
        .setName(t('settingCenterModeName'))
        .setDesc(t('settingCenterModeDesc'))
        .addDropdown((d) => d
          .addOption('snap', t('optCenterSnap'))
          .addOption('free', t('optCenterFree'))
          .setValue(this.val('centerMode') || 'snap')
          .onChange((v) => this.setVal('centerMode', v)));

      this.row(gWave, 'sharpCenter')
        .setName(t('settingSharpName'))
        .setDesc(t('settingSharpDesc'))
        .addToggle((tg) => tg
          .setValue(this.val('sharpCenter') !== false)
          .onChange((v) => this.setVal('sharpCenter', v)));

      this.row(gWave, 'reactZone')
        .setName(t('settingReactZoneName'))
        .setDesc(t('settingReactZoneDesc'))
        .addSlider((sl) => sl.setLimits(0, 600, 10).setDynamicTooltip()
          .setValue(numOr(this.val('reactZone'), 0))
          .onChange((v) => this.setVal('reactZone', v)));
    }

    this.row(gWave, 'horizontalDepth')
      .setName(t('settingHorizontalName'))
      .setDesc(t('settingHorizontalDesc'))
      .addToggle((tg) => tg
        .setValue(this.val('horizontalDepth'))
        .onChange(async (v) => { await this.setVal('horizontalDepth', v); this.redraw(); }));

    if (this.val('horizontalDepth')) {
      this.row(gWave, 'horizontalRange')
        .setName(t('settingHorizontalRangeName'))
        .setDesc(t('settingHorizontalRangeDesc'))
        .addSlider((sl) => sl.setLimits(10, 500, 5).setDynamicTooltip()
          .setValue(numOr(this.val('horizontalRange'), 60))
          .onChange((v) => this.setVal('horizontalRange', v)));

      if (this.tab !== 'mobile') this.row(gWave, 'horizontalMin')
        .setName(t('settingHorizontalMinName'))
        .setDesc(t('settingHorizontalMinDesc'))
        .addSlider((sl) => sl.setLimits(0, 100, 5).setDynamicTooltip()
          .setValue(numOr(this.val('horizontalMin'), 25))
          .onChange((v) => this.setVal('horizontalMin', v)));
    }

    this.row(gWave, 'peakBright')
      .setName(t('settingPeakBrightName'))
      .setDesc(t('settingPeakBrightDesc'))
      .addSlider((sl) => sl.setLimits(0, 100, 5).setDynamicTooltip()
        .setValue(numOr(this.val('peakBright'), 90))
        .onChange((v) => this.setVal('peakBright', v)));

    this.row(gWave, 'followTime')
      .setName(t('settingFollowName'))
      .setDesc(t('settingFollowDesc'))
      .addSlider((sl) => sl.setLimits(0, 500, 5).setDynamicTooltip()
        .setValue(numOr(this.val('followTime'), 70))
        .onChange((v) => this.setVal('followTime', v)));

    this.row(gWave, 'overshoot')
      .setName(t('settingOvershootName'))
      .setDesc(t('settingOvershootDesc'))
      .addSlider((sl) => sl.setLimits(0, 90, 1).setDynamicTooltip()
        .setValue(numOr(this.val('overshoot'), 30))
        .onChange((v) => this.setVal('overshoot', v)));

    /* ---------------- волна: тонкая настройка ---------------- */

    const gFine = this.group(gWave, t('settingsSectionWaveFine'), 'waveFine', false);

    if ((this.val('waveCurve') || 'bell') !== 'custom') {
      this.row(gFine, 'waveEdge')
        .setName(t('settingEdgeName'))
        .setDesc(t('settingEdgeDesc'))
        .addSlider((sl) => sl.setLimits(20, 400, 5).setDynamicTooltip()
          .setValue(numOr(this.val('waveEdge'), 115))
          .onChange((v) => this.setVal('waveEdge', v)));
    }

    this.row(gFine, 'restBright')
      .setName(t('settingRestBrightName'))
      .setDesc(t('settingRestBrightDesc'))
      .addSlider((sl) => sl.setLimits(0, 100, 5).setDynamicTooltip()
        .setValue(numOr(this.val('restBright'), 0))
        .onChange((v) => this.setVal('restBright', v)));

    this.row(gFine, 'restOpacity')
      .setName(t('settingRestOpacityName'))
      .setDesc(t('settingRestOpacityDesc'))
      .addSlider((sl) => sl.setLimits(10, 100, 5).setDynamicTooltip()
        .setValue(numOr(this.val('restOpacity'), 100))
        .onChange((v) => this.setVal('restOpacity', v)));

    this.row(gFine, 'peakOpacity')
      .setName(t('settingPeakOpacityName'))
      .setDesc(t('settingPeakOpacityDesc'))
      .addSlider((sl) => sl.setLimits(10, 100, 5).setDynamicTooltip()
        .setValue(numOr(this.val('peakOpacity'), 100))
        .onChange((v) => this.setVal('peakOpacity', v)));

    this.row(gFine, 'peakThick')
      .setName(t('settingPeakThickName'))
      .setDesc(t('settingPeakThickDesc'))
      .addSlider((sl) => sl.setLimits(50, 400, 10).setDynamicTooltip()
        .setValue(numOr(this.val('peakThick'), 100))
        .onChange((v) => this.setVal('peakThick', v)));

    this.row(gFine, 'riseTime')
      .setName(t('settingRiseName'))
      .setDesc(t('settingRiseDesc'))
      .addSlider((sl) => sl.setLimits(0, 800, 10).setDynamicTooltip()
        .setValue(numOr(this.val('riseTime'), 110))
        .onChange((v) => this.setVal('riseTime', v)));

    this.row(gFine, 'fallTime')
      .setName(t('settingFallName'))
      .setDesc(t('settingFallDesc'))
      .addSlider((sl) => sl.setLimits(0, 1500, 20).setDynamicTooltip()
        .setValue(numOr(this.val('fallTime'), 260))
        .onChange((v) => this.setVal('fallTime', v)));

    gFine.createEl('p', { cls: 'hr-settings-hint', text: t('panelWaveHint') });

    this.row(gFine, 'wavePinned')
      .setName(t('settingWavePinnedName'))
      .setDesc(t('settingWavePinnedDesc'))
      .addToggle((tg) => tg
        .setValue(!!this.val('wavePinned'))
        .onChange((v) => this.setVal('wavePinned', v)));

    // удержание Ctrl — только на компьютере
    if (this.tab !== 'mobile') {
      this.row(gFine, 'wavePeek')
        .setName(t('settingWavePeekName'))
        .setDesc(t('settingWavePeekDesc'))
        .addToggle((tg) => tg
          .setValue(!!this.val('wavePeek'))
          .onChange((v) => this.setVal('wavePeek', v)));
    }

    /* ---------------- полоски ---------------- */

    const gBars = this.group(containerEl, t('settingsSectionBars'), 'bars', false);

    this.row(gBars, 'barThickness')
      .setName(t('settingThicknessName'))
      .setDesc(t('settingThicknessDesc'))
      .addSlider((sl) => sl.setLimits(1, 14, 1).setDynamicTooltip()
        .setValue(numOr(this.val('barThickness'), 3))
        .onChange((v) => this.setVal('barThickness', v)));

    this.row(gBars, 'barWidth')
      .setName(t('settingBarWidthName'))
      .setDesc(t('settingBarWidthDesc'))
      .addSlider((sl) => sl.setLimits(30, 400, 5).setDynamicTooltip()
        .setValue(numOr(this.val('barWidth'), 100))
        .onChange((v) => this.setVal('barWidth', v)));

    const gLevels = this.group(gBars, t('settingsSectionLevels'), 'levels', false);
    gLevels.createEl('p', { cls: 'hr-settings-hint', text: t('levelsHint') });

    for (let lvl = 1; lvl <= 6; lvl++) {
      this.row(gLevels, 'lvlW' + lvl)
        .setName(t('settingLevelWidthName', lvl))
        .addSlider((sl) => sl.setLimits(2, 80, 1).setDynamicTooltip()
          .setValue(numOr(this.val('lvlW' + lvl), BASE_W[lvl]))
          .onChange((v) => this.setVal('lvlW' + lvl, v)));

      this.row(gLevels, 'lvlT' + lvl)
        .setName(t('settingLevelThickName', lvl))
        .addSlider((sl) => sl.setLimits(20, 300, 5).setDynamicTooltip()
          .setValue(numOr(this.val('lvlT' + lvl), 100))
          .onChange((v) => this.setVal('lvlT' + lvl, v)));

      this.row(gLevels, 'lvlO' + lvl)
        .setName(t('settingLevelFadeName', lvl))
        .addSlider((sl) => sl.setLimits(0, 100, 5).setDynamicTooltip()
          .setValue(numOr(this.val('lvlO' + lvl), 100))
          .onChange((v) => this.setVal('lvlO' + lvl, v)));
    }

    this.row(gBars, 'capsMode')
      .setName(t('settingCapsModeName'))
      .setDesc(t('settingCapsModeDesc'))
      .addDropdown((d) => d
        .addOption('on', t('optCapsOn'))
        .addOption('quiet', t('optCapsQuiet'))
        .addOption('off', t('optCapsOff'))
        .setValue(this.val('capsMode') || 'on')
        .onChange(async (v) => { await this.setVal('capsMode', v); this.redraw(); }));

    if ((this.val('capsMode') || 'on') !== 'off') {
      this.row(gLevels, 'capThick')
        .setName(t('settingCapThickName'))
        .addSlider((sl) => sl.setLimits(20, 300, 5).setDynamicTooltip()
          .setValue(numOr(this.val('capThick'), 100))
          .onChange((v) => this.setVal('capThick', v)));

      this.row(gLevels, 'capOpacity')
        .setName(t('settingCapOpacityName'))
        .addSlider((sl) => sl.setLimits(0, 100, 5).setDynamicTooltip()
          .setValue(numOr(this.val('capOpacity'), 75))
          .onChange((v) => this.setVal('capOpacity', v)));
    }

    if ((this.val('capsMode') || 'on') !== 'off') this.row(gLevels, 'capWidth')
      .setName(t('settingCapWidthName'))
      .setDesc(t('settingCapWidthDesc'))
      .addSlider((sl) => sl.setLimits(2, 60, 1).setDynamicTooltip()
        .setValue(numOr(this.val('capWidth'), CAP_W))
        .onChange((v) => this.setVal('capWidth', v)));

    /* ---------------- цвет и прозрачность ----------------

       Каждый цвет стоит в одной строке со своей прозрачностью: раньше они
       жили в разных концах экрана, и понять, какая прозрачность к какому
       цвету относится, было нельзя. */

    const gColour = this.group(containerEl, t('settingsSectionColour'), 'colour', false);
    gColour.createEl('p', { cls: 'hr-settings-hint', text: t('colourHint') });

    // цвет с кнопкой возврата к теме и, если задан ключ, ползунком прозрачности
    const paintRow = (box, colorKey, nameKey, themeVar, fadeKey, fadeDefault) => {
      const row = this.row(box, colorKey).setName(t(nameKey));
      row.addColorPicker((cp) => cp
        .setValue(this.val(colorKey) || this.themeHex(themeVar))
        .onChange((v) => this.setVal(colorKey, v)));
      if (fadeKey) {
        row.addSlider((sl) => sl.setLimits(0, 100, 5).setDynamicTooltip()
          .setValue(numOr(this.val(fadeKey), fadeDefault))
          .onChange((v) => this.setVal(fadeKey, v)));
      }
      row.addExtraButton((b) => b
        .setIcon('rotate-ccw')
        .setTooltip(t('resetToTheme'))
        .onClick(async () => { await this.setVal(colorKey, ''); this.redraw(); }));
      return row;
    };

    paintRow(gColour, 'barColor', 'settingBarColorName', '--text-faint', 'barOpacity', 100)
      .setDesc(t('settingBarColorDesc'));

    paintRow(gColour, 'activeColor', 'settingActiveColorName', '--text-normal', 'activeOpacity', 100)
      .setDesc(t('settingActiveColorDesc'));

    paintRow(gColour, 'waveColor', 'settingWaveColorName', '--text-normal')
      .setDesc(t('settingWaveColorDesc'));

    paintRow(gColour, 'glowColor', 'settingGlowColorName', '--text-normal')
      .setDesc(t('settingGlowColorDesc'));

    this.row(gColour, 'useGradient')
      .setName(t('settingGradientName'))
      .setDesc(t('settingGradientDesc'))
      .addToggle((tg) => tg
        .setValue(this.val('useGradient'))
        .onChange(async (v) => { await this.setVal('useGradient', v); this.redraw(); }));

    if (this.val('useGradient')) {
      paintRow(gColour, 'gradientFrom', 'settingGradientStartName', '--text-muted');
      paintRow(gColour, 'gradientTo', 'settingGradientEndName', '--text-normal');
    }

    const gPanel = this.group(gColour, t('settingsSectionPanelLook'), 'panelLook', false);
    paintRow(gPanel, 'panelBg', 'settingPanelBgName', '--background-primary');
    paintRow(gPanel, 'panelText', 'settingPanelTextName', '--text-muted');
    paintRow(gPanel, 'panelActiveText', 'settingPanelActiveTextName', '--text-normal');

    const gPrevColour = this.group(gColour, t('settingsSectionPreviewLook'), 'previewLook', false);
    paintRow(gPrevColour, 'previewBg', 'settingPreviewBgName', '--background-primary');
    paintRow(gPrevColour, 'previewTitleColor', 'settingPreviewTitleColorName', '--text-normal');
    paintRow(gPrevColour, 'previewTextColor', 'settingPreviewTextColorName', '--text-muted');

    /* ---------------- подсветка положения ---------------- */

    const gGlow = this.group(containerEl, t('settingsSectionGlow'), 'glow', false);

    gGlow.createEl('p', { cls: 'hr-settings-hint', text: t('glowHint') });

    this.row(gGlow, 'activeGlow')
      .setName(t('settingActiveGlowName'))
      .setDesc(t('settingActiveGlowDesc'))
      .addDropdown((d) => d
        .addOption('always', t('optGlowAlways'))
        .addOption('hover', t(this.tab === 'mobile' ? 'optGlowTouch' : 'optGlowHover'))
        .addOption('off', t('optGlowOff'))
        .setValue(this.val('activeGlow') || 'always')
        .onChange((v) => this.setVal('activeGlow', v)));

    this.row(gGlow, 'activeMove')
      .setName(t('settingActiveMoveName'))
      .setDesc(t('settingActiveMoveDesc'))
      .addDropdown((d) => d
        .addOption('travel', t('optMoveTravel'))
        .addOption('instant', t('optMoveInstant'))
        .setValue(this.val('activeMove') || 'travel')
        .onChange(async (v) => { await this.setVal('activeMove', v); this.redraw(); }));

    if ((this.val('activeMove') || 'travel') === 'travel') {
      this.row(gGlow, 'activeTravelTime')
        .setName(t('settingTravelTimeName'))
        .setDesc(t('settingTravelTimeDesc'))
        .addSlider((sl) => sl.setLimits(0, 900, 10).setDynamicTooltip()
          .setValue(numOr(this.val('activeTravelTime'), 510))
          .onChange((v) => this.setVal('activeTravelTime', v)));

      this.row(gGlow, 'activeOvershoot')
        .setName(t('settingTravelOvershootName'))
        .setDesc(t('settingTravelOvershootDesc'))
        .addSlider((sl) => sl.setLimits(0, 90, 1).setDynamicTooltip()
          .setValue(numOr(this.val('activeOvershoot'), 50))
          .onChange((v) => this.setVal('activeOvershoot', v)));

      this.row(gGlow, 'activeTrail')
        .setName(t('settingTravelTrailName'))
        .setDesc(t('settingTravelTrailDesc'))
        .addSlider((sl) => sl.setLimits(0, 100, 5).setDynamicTooltip()
          .setValue(numOr(this.val('activeTrail'), 100))
          .onChange((v) => this.setVal('activeTrail', v)));
    }

    this.row(gGlow, 'haloMode')
      .setName(t('settingHaloModeName'))
      .setDesc(t('settingHaloModeDesc'))
      .addDropdown((d) => d
        .addOption('always', t('optGlowAlways'))
        .addOption('hover', t(this.tab === 'mobile' ? 'optGlowTouch' : 'optGlowHover'))
        .addOption('off', t('optGlowOff'))
        .setValue(this.val('haloMode') || 'always')
        .onChange(async (v) => { await this.setVal('haloMode', v); this.redraw(); }));

    if ((this.val('haloMode') || 'always') !== 'off') {
      const span = this.haloSpanValue();
      this.row(gGlow, 'haloSpan')
        .setName(t('settingHaloSpanName'))
        .setDesc(t('settingHaloSpanDesc', span, (span - 1) / 2))
        .addSlider((sl) => sl.setLimits(1, 25, 2).setDynamicTooltip()
          .setValue(span)
          .onChange(async (v) => { await this.setVal('haloSpan', v); this.redraw(); }));

      const gHalo = this.group(gGlow, t('settingsSectionHaloSteps'), 'haloSteps', true);
      gHalo.createEl('p', { cls: 'hr-settings-hint', text: t('haloStepsHint') });
      for (let d = 0; d < (span - 1) / 2; d++) {
        const key = 'haloS' + d;
        this.row(gHalo, key)
          .setName(t('settingHaloStepName', d + 1))
          .addSlider((sl) => sl.setLimits(0, 100, 1).setDynamicTooltip()
            .setValue(numOr(this.val(key), 0))
            .onChange((v) => this.setVal(key, v)));
      }
    }

    this.row(gGlow, 'glowLift')
      .setName(t('settingGlowLiftName'))
      .setDesc(t('settingGlowLiftDesc'))
      .addSlider((sl) => sl.setLimits(0, 100, 5).setDynamicTooltip()
        .setValue(numOr(this.val('glowLift'), 70))
        .onChange((v) => this.setVal('glowLift', v)));

    /* ---------------- подсказка ---------------- */

    const gPrev = this.group(containerEl, t('settingsSectionPreview'), 'preview', false);

    this.row(gPrev, 'hoverPreview')
      .setName(t('settingPreviewToggleName'))
      .setDesc(t('settingPreviewToggleDesc'))
      .addToggle((tg) => tg
        .setValue(this.val('hoverPreview'))
        .onChange(async (v) => { await this.setVal('hoverPreview', v); this.redraw(); }));

    if (this.val('hoverPreview')) {
      this.row(gPrev, 'previewTrigger')
        .setName(t('settingPreviewTriggerName'))
        .setDesc(t('settingPreviewTriggerDesc'))
        .addDropdown((d) => d
          .addOption('both', t('optTriggerBoth'))
          .addOption('bars', t('optPreviewBars'))
          .addOption('outline', t('optPreviewOutline'))
          .addOption('off', t('optPreviewOff'))
          .setValue(this.val('previewTrigger'))
          .onChange((v) => this.setVal('previewTrigger', v)));

      this.row(gPrev, 'previewPlacement')
        .setName(t('settingPreviewPlaceName'))
        .setDesc(t('settingPreviewPlaceDesc'))
        .addDropdown((d) => d
          .addOption('auto', t('optPlaceAuto'))
          .addOption('rail', t('optPlaceRail'))
          .addOption('outline', t('optPlaceOutline'))
          .setValue(this.val('previewPlacement'))
          .onChange((v) => this.setVal('previewPlacement', v)));

      this.row(gPrev, 'previewChars')
        .setName(t('settingPreviewLenName'))
        .setDesc(t('settingPreviewLenDesc'))
        .addSlider((sl) => sl.setLimits(40, 600, 20).setDynamicTooltip()
          .setValue(numOr(this.val('previewChars'), 160))
          .onChange((v) => this.setVal('previewChars', v)));

      this.row(gPrev, 'previewGap')
        .setName(t('settingPreviewGapName'))
        .setDesc(t('settingPreviewGapDesc'))
        .addSlider((sl) => sl.setLimits(0, 120, 2).setDynamicTooltip()
          .setValue(numOr(this.val('previewGap'), 12))
          .onChange((v) => this.setVal('previewGap', v)));

      this.row(gPrev, 'previewWidth')
        .setName(t('settingPreviewWidthName'))
        .setDesc(t('settingPreviewWidthDesc'))
        .addSlider((sl) => sl.setLimits(140, 620, 10).setDynamicTooltip()
          .setValue(numOr(this.val('previewWidth'), 260))
          .onChange((v) => this.setVal('previewWidth', v)));

      /* ------- шрифты подсказки ------- */

      const gFont = this.group(gPrev, t('settingsSectionPreviewType'), 'previewType', false);
      gFont.createEl('p', { cls: 'hr-settings-hint', text: t('previewTypeHint') });

      const fontRow = (key, nameKey) => this.row(gFont, key)
        .setName(t(nameKey))
        .addDropdown((d) => d
          .addOption('interface', t('optFontInterface'))
          .addOption('text', t('optFontText'))
          .addOption('mono', t('optFontMono'))
          .addOption('system', t('optFontSystem'))
          .addOption('sans', t('optFontSans'))
          .addOption('serif', t('optFontSerif'))
          .addOption('slab', t('optFontSlab'))
          .addOption('monospace', t('optFontMonospace'))
          .setValue(this.val(key) || 'interface')
          .onChange((v) => this.setVal(key, v)));

      fontRow('previewTitleFont', 'settingPreviewTitleFontName');

      this.row(gFont, 'previewTitleSize')
        .setName(t('settingPreviewTitleSizeName'))
        .addSlider((sl) => sl.setLimits(9, 32, 1).setDynamicTooltip()
          .setValue(numOr(this.val('previewTitleSize'), 13))
          .onChange((v) => this.setVal('previewTitleSize', v)));

      this.row(gFont, 'previewTitleWeight')
        .setName(t('settingPreviewTitleWeightName'))
        .addSlider((sl) => sl.setLimits(100, 900, 100).setDynamicTooltip()
          .setValue(numOr(this.val('previewTitleWeight'), 600))
          .onChange((v) => this.setVal('previewTitleWeight', v)));

      fontRow('previewTextFont', 'settingPreviewTextFontName');

      this.row(gFont, 'previewTextSize')
        .setName(t('settingPreviewTextSizeName'))
        .addSlider((sl) => sl.setLimits(8, 28, 1).setDynamicTooltip()
          .setValue(numOr(this.val('previewTextSize'), 12))
          .onChange((v) => this.setVal('previewTextSize', v)));

      this.row(gFont, 'previewTextWeight')
        .setName(t('settingPreviewTextWeightName'))
        .addSlider((sl) => sl.setLimits(100, 900, 100).setDynamicTooltip()
          .setValue(numOr(this.val('previewTextWeight'), 400))
          .onChange((v) => this.setVal('previewTextWeight', v)));

      this.row(gFont, 'previewLineHeight')
        .setName(t('settingPreviewLineName'))
        .setDesc(t('settingPreviewLineDesc'))
        .addSlider((sl) => sl.setLimits(90, 250, 5).setDynamicTooltip()
          .setValue(numOr(this.val('previewLineHeight'), 145))
          .onChange((v) => this.setVal('previewLineHeight', v)));

    }

    /* ---------------- структура (общее для устройств) ---------------- */

    const gOutline = this.group(containerEl, t('settingsSectionOutline'), 'outline', false);

    new Setting(gOutline)
      .setName(t('settingSearchName'))
      .setDesc(t('settingSearchDesc'))
      .addToggle((tg) => tg
        .setValue(this.plugin.settings.showSearch)
        .onChange(async (v) => { this.plugin.settings.showSearch = v; await this.apply(); }));

    new Setting(gOutline)
      .setName(t('settingSearchBottomName'))
      .setDesc(t('settingSearchBottomDesc'))
      .addToggle((tg) => tg
        .setValue(this.plugin.settings.searchAtBottom)
        .onChange(async (v) => { this.plugin.settings.searchAtBottom = v; await this.apply(); }));

    new Setting(gOutline)
      .setName(t('settingTrashMaxName'))
      .setDesc(t('settingTrashMaxDesc'))
      .addText((tx) => tx
        .setValue(String(this.plugin.settings.trashMax))
        .onChange(async (v) => {
          const n = parseInt(v, 10);
          this.plugin.settings.trashMax = isNaN(n) ? 20 : Math.max(1, n);
          await this.save();
        }));

    /* ---------------- связь с автором ---------------- */

    const contact = containerEl.createDiv({ cls: 'hr-settings-contact' });
    contact.createEl('div', { text: t('contactLine') });
    const link = contact.createEl('a', { text: AUTHOR_EMAIL });
    link.href = 'mailto:' + AUTHOR_EMAIL;
    contact.createEl('div', { cls: 'hr-settings-contribute', text: t('contributeLine') });

  }
}

module.exports = HeadingRailPlugin;
