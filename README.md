# Heading Rail

**Heading Rail is a table of contents and heading navigator for Obsidian.** Instead of a flat list, every heading in your note becomes a short bar docked to the edge of the page. The rail tracks where you are as you scroll, reacts to the cursor with a fully configurable wave, opens into a searchable outline, lets you scrub through the document by dragging, and can copy or delete whole sections with a history to restore them. It works on desktop and on mobile, with separate settings for each.

*[English](#heading-rail) · [Русский](#русский)*

![The rail beside a long note, with the wave under the cursor](screenshots/hr-rail-wave.png)

## What it is for

Long notes are hard to move around in. Obsidian's built-in outline is a list in a sidebar: it tells you what headings exist, but not where you are, and it takes a whole pane to do it. Heading Rail puts the structure of the note right beside the text, at the size of a scrollbar, and turns it into something you navigate with rather than just look at.

It is built for people who lean on headings: long documents, research notes, specifications, books in progress, knowledge bases where a single note runs to dozens of sections.

## At a glance

| | |
|---|---|
| Live tracking of the current section while scrolling | Yes |
| Hover wave with every parameter adjustable — shape, length, colour, opacity, thickness, motion | Yes |
| Halo around the current section that travels when the section changes | Yes |
| Searchable outline panel, pinned or peeked with Ctrl | Yes |
| Drag-to-scroll (scrubbing) with the mouse, the space bar, or a finger | Yes |
| Preview card with the start of each section | Yes |
| Select, copy and delete whole sections, with a restore history | Yes |
| Several columns of bars on very long notes | Yes |
| Separate desktop and mobile profiles, linkable setting by setting | Yes |
| Ready-made styles, and a way to send in your own | Yes |
| Interface in English, German, French, Russian, Japanese, Korean and Hindi | Yes |
| Follows light and dark themes without configuration | Yes |
| Network access, accounts, telemetry | None |

## Features

### The rail

Every heading is a bar; its length reflects the heading level, so the shape of the document is visible at a glance. The bar for the section you are reading is highlighted and follows you as you scroll. Two short marks at the ends stand for the start and the end of the note. On notes too long for one column, the rail splits into several.

![Halo around the current section](screenshots/hr-halo-travel.png)

### The wave

Pointing at the rail sends a wave through the bars around the cursor. The wave is not a fixed effect: it is built from a small number of independent parts, and each one can be changed on its own. The shape can be a bell, a sharp peak, a flat plateau, an arc, a wedge, a hard step, a ripple, or a shape you draw yourself bar by bar in pixels. It can snap to one bar at a time or follow the cursor freely. It can catch up instantly or with a spring that overshoots and settles. Length, colour, opacity and thickness each travel from their own resting value to their own peak value. One master slider sets how loudly all of it plays.

The point is that any hover animation you have seen elsewhere can be rebuilt here from settings alone, and so can ones nobody has made yet.

### Highlighting where you are

The current bar can be highlighted always, only while you point at the rail, or not at all. Around it sits a halo: you choose how many bars it covers and how bright each step is, mirrored above and below. When the current section changes, the whole halo travels to the new place with its own speed, overshoot and trail, instead of jumping.

### The outline

Right-click a bar, or use the toolbar button, to pin the outline open beside the rail; hold Ctrl to peek at it for as long as the key is down. The outline has its own search field, keeps the current section centred, and shows a marker for the part of the rail it covers.

![The pinned outline with search](screenshots/hr-outline-pinned.png)

### Preview

Hovering a bar shows a card with the heading and the first lines of its section, so you can find the right place without scrolling there. Its distance from the rail, width, fonts, sizes, weights, line spacing and colours are all adjustable.

![Preview card beside the rail](screenshots/hr-preview-card.png)

### Moving through the note

Click a bar to jump to its heading; choose whether the heading lands at the top of the screen, a third of the way down, or in the middle. Hold the mouse button and drag along the rail to scrub through the note the way you would along a video timeline, or hold Space and just move the cursor. The mouse wheel over the rail moves several times faster than over the text.

### Sections as units

Select a section in the outline, a range with Shift, or scattered sections with Alt, then copy or delete them together. A section is its heading plus everything below it down to the next heading of the same or higher level. Every deletion goes into a history with one-click restore.

### Mobile

Everything works on phones and tablets, with touch in place of hover: tap a bar to jump, drag a finger along the rail to scrub, long-press to open the outline or select. The mobile profile only shows settings that actually do something on a touchscreen. If Obsidian's own edge-swipe gesture gets in the way on your device, the plugin can be switched off for phones alone while it keeps working on desktop.

![The rail on a phone](screenshots/hr-mobile-rail.png)
![The outline on a phone](screenshots/hr-mobile-outline.png)

### Settings and styles

The settings are split into Desktop and Mobile tabs. Each mobile setting has a chain button that makes it follow the desktop value, one setting at a time. Sections fold away, so the few controls that matter most are visible first and the fine tuning stays out of the way.

A **style** is a complete set of values applied at once. The plugin ships with one, **Base**, which is on from the moment you install it. Styles made by other people will be added to the list after review: if you have arrived at something good, the Share button puts your settings into an email for you to send.

![Wave settings](screenshots/hr-settings-wave.png)
![Styles and sharing](screenshots/hr-settings-styles.png)

Colours left empty come from your theme, so the rail looks right in light and dark themes without any setup. Colours that come from a style are adjusted automatically if they would disappear against your theme. Colours you set yourself are left exactly as you set them.

## Usage

| Action | Desktop | Mobile |
|---|---|---|
| Jump to a section | Click a bar | Tap a bar |
| Scrub through the note | Drag along the rail, or hold Space and move | Drag a finger along the rail |
| Peek at the outline | Hold Ctrl | — |
| Pin the outline | Right-click a bar, or the toolbar button | Long-press a bar, or the toolbar button |
| Step between headings | Arrow keys over the rail with the outline open, or Ctrl + arrows anywhere | — |
| Select sections | Shift-click for a range, Alt-click to add or remove | Long-press, then tap to add or remove |
| Copy or delete | Right-click a selected entry | Long-press a selected entry |
| Restore a deletion | History button in the note toolbar | Same |

The full walkthrough is in the guide: [English](GUIDE.md) · [Русский](GUIDE.ru.md).

## Install

From Obsidian: **Settings → Community plugins → Browse**, search for **Heading Rail**, install and enable. Or open the plugin's page on [Obsidian's community site](https://obsidian.md/plugins?id=heading-rail) and use **Add to Obsidian**.

Manually:

1. Download `manifest.json`, `main.js` and `styles.css` from the latest [release](../../releases).
2. Put them in `<your vault>/.obsidian/plugins/heading-rail/`.
3. Restart Obsidian and enable **Heading Rail** under Settings → Community plugins.

## About deletion

This is the one feature that changes your files. Before every deletion the plugin checks that the outline still matches the file on disk and refuses to write if the file changed while the operation was running. Deleted sections go into a history with one-click restore, and Obsidian's own undo also works. Still — it deletes text, so treat it with the respect that deserves.

## Privacy

The plugin makes no network requests, has no accounts and collects nothing. The Share button only opens your own mail app with a letter you can read before sending; it contains the plugin's settings and nothing from your vault.

## Contributing

Made a fork that's genuinely better? Send me the source and tell me how you did it. If it really is better, I'll ship it in the next version and credit you as a co-author. I may rework your code along the way, but if it served as the basis, you get the credit regardless.

Ideas for this plugin, or for another one, are welcome at **lavrowws@gmail.com**.

## Development

Plain JavaScript, no bundler. `core.js` holds all the logic and `styles.css` all the appearance; `build.py` assembles `main.js` from the two and embeds a fallback copy of the styles, so the plugin still renders if `styles.css` fails to load.

```
python3 build.py
```

Edit `core.js` and `styles.css` — never `main.js`, it is generated.

## License

[MIT](LICENSE)

---

# Русский

**Heading Rail — это оглавление и навигатор по заголовкам для Obsidian.** Вместо плоского списка каждый заголовок заметки становится короткой полоской у края страницы. Рельс сам отслеживает, где вы находитесь при прокрутке, откликается на курсор волной, которую можно настроить целиком, раскрывается в структуру с поиском, даёт листать документ протяжкой и умеет копировать и удалять целые разделы с историей для восстановления. Работает на компьютере и на телефоне, с отдельными настройками для каждого.

![Рельс рядом с длинной заметкой, волна под курсором](screenshots/hr-rail-wave.png)

## Для чего он

По длинным заметкам трудно перемещаться. Встроенная структура Obsidian — это список в боковой панели: она показывает, какие заголовки есть, но не показывает, где вы сейчас, и занимает под это целую панель. Heading Rail ставит структуру заметки прямо рядом с текстом, размером с полосу прокрутки, и превращает её в то, чем перемещаются, а не на что смотрят.

Он сделан для тех, кто опирается на заголовки: длинные документы, исследовательские заметки, спецификации, книги в работе, базы знаний, где одна заметка тянется на десятки разделов.

## Коротко

| | |
|---|---|
| Отслеживание текущего раздела при прокрутке | Да |
| Волна при наведении, настраивается каждый параметр — форма, длина, цвет, прозрачность, толщина, движение | Да |
| Ореол вокруг текущего раздела, переезжающий при его смене | Да |
| Структура с поиском, закреплённая или открытая удержанием Ctrl | Да |
| Протяжка по документу мышью, пробелом или пальцем | Да |
| Подсказка с началом каждого раздела | Да |
| Выделение, копирование и удаление целых разделов с историей восстановления | Да |
| Несколько столбцов полосок на очень длинных заметках | Да |
| Отдельные профили для компьютера и телефона, связываемые по одной настройке | Да |
| Готовые наборы настроек и возможность прислать свой | Да |
| Интерфейс на английском, немецком, французском, русском, японском, корейском и хинди | Да |
| Подстраивается под светлую и тёмную тему без настройки | Да |
| Сеть, учётные записи, сбор данных | Нет |

## Возможности

### Рельс

Каждый заголовок — полоска; её длина отражает уровень заголовка, так что форма документа видна сразу. Полоска раздела, который вы читаете, подсвечена и едет вслед за прокруткой. Две короткие метки по краям обозначают начало и конец заметки. На заметках, которым мало одного столбца, рельс делится на несколько.

![Ореол вокруг текущего раздела](screenshots/hr-halo-travel.png)

### Волна

При наведении на рельс по полоскам вокруг курсора проходит волна. Это не готовый эффект, а сборка из нескольких независимых частей, и каждая меняется сама по себе. Форма — колокол, острый пик, плоское плато, дуга, клин, ступень, рябь или форма, нарисованная вами по полоскам в пикселях. Центр может держаться одной полоски или свободно идти за курсором. Волна может догонять курсор мгновенно или пружиной, которая проскакивает и возвращается. Длина, цвет, прозрачность и толщина идут каждая от своего значения в покое к своему значению на пике. Один общий ползунок задаёт, насколько громко всё это звучит.

Смысл в том, что любую анимацию при наведении, которую вы видели где-то ещё, здесь можно собрать одними настройками — как и ту, которую ещё никто не делал.

### Где вы сейчас

Текущую полоску можно подсвечивать всегда, только при наведении на рельс или не подсвечивать вовсе. Вокруг неё — ореол: вы выбираете, сколько полосок он захватывает и насколько ярка каждая ступень, одинаково вверх и вниз. Когда текущий раздел меняется, ореол целиком переезжает на новое место со своей скоростью, проскоком и следом, а не перескакивает.

### Структура

Правый щелчок по полоске или кнопка на панели заметки закрепляют структуру рядом с рельсом; удержание Ctrl показывает её, пока клавиша нажата. У структуры свой поиск, она держит текущий раздел по центру и показывает метку той части рельса, которую сейчас охватывает.

![Закреплённая структура с поиском](screenshots/hr-outline-pinned.png)

### Подсказка

При наведении на полоску появляется окошко с заголовком и первыми строками раздела — нужное место можно найти, не прокручивая к нему. Расстояние от рельса, ширина, шрифты, размеры, толщина, межстрочный интервал и цвета — всё настраивается.

![Подсказка рядом с рельсом](screenshots/hr-preview-card.png)

### Перемещение по заметке

Щелчок по полоске переносит к заголовку; можно выбрать, где он встанет — вверху экрана, на трети высоты или посередине. Зажмите кнопку мыши и тяните вдоль рельса — документ поедет следом, как при перемотке видео; то же самое можно делать с зажатым пробелом, просто двигая курсор. Колесо мыши над рельсом прокручивает в несколько раз быстрее, чем над текстом.

### Разделы как единое целое

Выделите раздел в структуре, диапазон — с Shift, разрозненные разделы — с Alt, и скопируйте или удалите их разом. Раздел — это заголовок и всё под ним до следующего заголовка того же или более высокого уровня. Каждое удаление попадает в историю, откуда восстанавливается одним нажатием.

### Телефон

Всё работает на телефонах и планшетах, касанием вместо наведения: нажатие на полоску — переход, протяжка пальцем по рельсу — перемотка, долгое нажатие — открыть структуру или выделить. В мобильном профиле показаны только те настройки, которые на сенсорном экране действительно что-то делают. Если на вашем устройстве мешает собственный жест Obsidian у края экрана, плагин можно выключить только на телефоне, а на компьютере он продолжит работать.

![Рельс на телефоне](screenshots/hr-mobile-rail.png)
![Структура на телефоне](screenshots/hr-mobile-outline.png)

### Настройки и наборы

Настройки разделены на вкладки «Компьютер» и «Телефон». У каждой настройки телефона есть кнопка-звено: нажатая, она заставляет настройку брать значение с компьютера — по одной настройке за раз. Разделы сворачиваются, поэтому сначала видно несколько главных ползунков, а тонкая настройка не мешает.

**Набор** — это полный комплект значений, применяемый разом. С плагином идёт один — **Base**, он включён с момента установки. Наборы от других людей будут добавляться в список после проверки: если у вас получилось что-то удачное, кнопка «Поделиться» сложит ваши настройки в письмо, которое вы отправите сами.

![Настройки волны](screenshots/hr-settings-wave.png)
![Наборы и отправка своего](screenshots/hr-settings-styles.png)

Пустые цвета берутся из вашей темы, поэтому рельс правильно выглядит и в светлой, и в тёмной теме без всякой настройки. Цвета из набора подстраиваются сами, если на вашей теме они бы пропали. Цвета, выставленные вами, остаются ровно такими, какими вы их выставили.

## Как пользоваться

| Действие | Компьютер | Телефон |
|---|---|---|
| Перейти к разделу | Щелчок по полоске | Нажатие на полоску |
| Листать протяжкой | Тянуть по рельсу или держать пробел и двигать курсор | Вести пальцем по рельсу |
| Заглянуть в структуру | Держать Ctrl | — |
| Закрепить структуру | Правый щелчок по полоске или кнопка на панели | Долгое нажатие на полоску или кнопка на панели |
| Шаг между заголовками | Стрелки над рельсом при открытой структуре или Ctrl + стрелки где угодно | — |
| Выделить разделы | Shift-щелчок — диапазон, Alt-щелчок — добавить или убрать | Долгое нажатие, дальше нажатиями добавлять и убирать |
| Скопировать или удалить | Правый щелчок по выделенному | Долгое нажатие на выделенное |
| Вернуть удалённое | Кнопка истории на панели заметки | То же |

Подробное руководство: [English](GUIDE.md) · [Русский](GUIDE.ru.md).

## Установка

Из Obsidian: **Настройки → Сторонние плагины → Обзор**, найдите **Heading Rail**, установите и включите. Или откройте страницу плагина на [сайте сообщества Obsidian](https://obsidian.md/plugins?id=heading-rail) и нажмите **Add to Obsidian**.

Вручную:

1. Скачайте `manifest.json`, `main.js` и `styles.css` из последнего [релиза](../../releases).
2. Положите их в `<ваше хранилище>/.obsidian/plugins/heading-rail/`.
3. Перезапустите Obsidian и включите **Heading Rail** в разделе «Сторонние плагины».

## Про удаление

Это единственная функция, которая меняет ваши файлы. Перед каждым удалением плагин проверяет, что структура всё ещё совпадает с файлом на диске, и отказывается записывать, если файл изменился, пока шла операция. Удалённые разделы попадают в историю с восстановлением в одно нажатие, и обычная отмена Obsidian тоже работает. И всё же — это удаление текста, относитесь к нему соответственно.

## Приватность

Плагин не ходит в сеть, не требует учётных записей и ничего не собирает. Кнопка «Поделиться» только открывает ваш почтовый клиент с письмом, которое вы можете прочитать перед отправкой; в нём настройки плагина и ничего из вашего хранилища.

## Участие

Сделали форк, который реально лучше? Пришлите исходник и расскажите, как вы это реализовали. Если это правда лучше — обновлю версию и отмечу вас соавтором. Код могу переделать по-своему, но если он лёг в основу, отмечу вас всё равно.

Идеи по этому плагину или по другим — на **lavrowws@gmail.com**.

## Разработка

Обычный JavaScript, без сборщика. Вся логика — в `core.js`, всё оформление — в `styles.css`; `build.py` собирает из них `main.js` и встраивает резервную копию стилей, чтобы плагин рисовался, даже если `styles.css` не загрузится.

```
python3 build.py
```

Правьте `core.js` и `styles.css` — никогда не `main.js`, он собирается.

## Лицензия

[MIT](LICENSE)
