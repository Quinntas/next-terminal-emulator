import Themes from '../../../themes.json';

export const cmdTheme = async (
    args: string[],
    callback?: (value: string) => string,
): Promise<string> => {
    if (args.length === 0) {
        return `Usage: theme [arg]
Args:
  - ls: list all themes
  - set: set a theme
  - random: set a random theme

Example: 
  theme ls # to list all themes
  theme set Gruvbox # to set a theme`;
    }

    switch (args[0]) {
        case 'ls':
            let result = Themes.map((theme) => theme.name.toLowerCase()).join(', ');
            result += '\n\n';
            result += `You can preview all these themes <a href="https://github.com/m4tt72/terminal/tree/master/docs/themes">in the docs</a>`;

            return result;
        case 'set':
            const selectedTheme = args[1];
            if (!callback)
                throw new Error('Callback function is not defined');
            return callback(selectedTheme);
        case 'random':
            const randomTheme = Themes[Math.floor(Math.random() * Themes.length)];
            if (!callback)
                throw new Error('Callback function is not defined');
            return callback(randomTheme.name.toLowerCase());
            default:
                throw new Error('Invalid argument');
    }
};
