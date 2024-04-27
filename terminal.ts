// Below you can find colors reference of text to command when running node.js application:

// console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
// console.log('\x1b[33m%s\x1b[0m', stringToMakeYellow);  //yellow
// Note %s is where in the string (the second argument) gets injected. \x1b[0m resets the terminal color so it doesn't continue to be the chosen color anymore after this point.

// Colors reference

export const TERMINAL_Reset = "\x1b[0m";
export const TERMINAL_Bright = "\x1b[1m";
export const TERMINAL_Dim = "\x1b[2m";
export const TERMINAL_Underscore = "\x1b[4m";
export const TERMINAL_Blink = "\x1b[5m";
export const TERMINAL_Reverse = "\x1b[7m";
export const TERMINAL_Hidden = "\x1b[8m";
export const TERMINAL_FgBlack = "\x1b[30m";
export const TERMINAL_FgRed = "\x1b[31m";
export const TERMINAL_FgGreen = "\x1b[32m";
export const TERMINAL_FgYellow = "\x1b[33m";
export const TERMINAL_FgBlue = "\x1b[34m";
export const TERMINAL_FgMagenta = "\x1b[35m";
export const TERMINAL_FgCyan = "\x1b[36m";
export const TERMINAL_FgWhite = "\x1b[37m";
export const TERMINAL_FgGray = "\x1b[90m";
export const TERMINAL_BgBlack = "\x1b[40m";
export const TERMINAL_BgRed = "\x1b[41m";
export const TERMINAL_BgGreen = "\x1b[42m";
export const TERMINAL_BgYellow = "\x1b[43m";
export const TERMINAL_BgBlue = "\x1b[44m";
export const TERMINAL_BgMagenta = "\x1b[45m";
export const TERMINAL_BgCyan = "\x1b[46m";
export const TERMINAL_BgWhite = "\x1b[47m";
export const TERMINAL_BgGray = "\x1b[100m";
