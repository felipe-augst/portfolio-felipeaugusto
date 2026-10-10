// Atributo do <html> que habilita a tela de boas-vindas (variante `splash:` do globals.css).
export const SPLASH_ATTRIBUTE = 'data-splash'

// Atributo do <html> que marca "JS disponível", para estados iniciais que só valem com JS.
export const JS_ATTRIBUTE = 'data-js'

const SPLASH_SEEN_KEY = 'splash-seen'

// Roda no <head>, antes da primeira pintura: marca "JS disponível" e, na primeira página da sessão,
// habilita a tela e grava a flag. Storage indisponível conta como "não vista". O conteúdo é fixo
// para o hash dele entrar na CSP.
export const SPLASH_SCRIPT = `(function(){var r=document.documentElement;r.setAttribute('${JS_ATTRIBUTE}','');try{if(sessionStorage.getItem('${SPLASH_SEEN_KEY}'))return;sessionStorage.setItem('${SPLASH_SEEN_KEY}','1')}catch(e){}r.setAttribute('${SPLASH_ATTRIBUTE}','')})()`
