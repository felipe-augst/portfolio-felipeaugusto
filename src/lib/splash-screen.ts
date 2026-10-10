// Atributo do <html> que habilita a tela de boas-vindas (variante `splash:` do globals.css).
export const SPLASH_ATTRIBUTE = 'data-splash'

const SPLASH_SEEN_KEY = 'splash-seen'

// Roda no <head>, antes da primeira pintura: na primeira página da sessão, habilita a tela e grava
// a flag. O conteúdo é fixo para o hash dele entrar na CSP.
export const SPLASH_SCRIPT = `(function(){if(sessionStorage.getItem('${SPLASH_SEEN_KEY}'))return;sessionStorage.setItem('${SPLASH_SEEN_KEY}','1');document.documentElement.setAttribute('${SPLASH_ATTRIBUTE}','')})()`
