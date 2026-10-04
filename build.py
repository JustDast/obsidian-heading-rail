# Собирает main.js из core.js + styles.css (встраивает запасную копию стилей).
# main.js руками не править — только пересобирать: python3 build.py
import pathlib
root = pathlib.Path(__file__).parent
core = (root / 'core.js').read_text(encoding='utf-8')
css = (root / 'styles.css').read_text(encoding='utf-8')
esc = css.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
first, rest = core.split('\n', 1)
head = (first + '\n\n/* Страховочная копия styles.css — подключается, только если внешний файл\n'
        '   не загрузился. Собирается автоматически из styles.css, править надо там. */\n'
        'const FALLBACK_CSS = `' + esc + '`;')
(root / 'main.js').write_text(head + '\n' + rest, encoding='utf-8')
print('main.js собран')
