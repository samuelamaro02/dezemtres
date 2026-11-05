import { readFile, writeFile } from 'node:fs/promises';
import { lotes } from '../config/lotes.mjs';

// Aplica a configuração ao HTML antes da publicação, sem depender do navegador.
const indexPath = new URL('../dist/index.html', import.meta.url);
const html = await readFile(indexPath, 'utf8');
const processed = new Set();
const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const updated = html.replace(/<article\b[^>]*data-lote="([^"]+)"[^>]*>[\s\S]*?<\/article>/g, (card, id) => {
  const lote = lotes[id];
  if (!lote || typeof lote.ativo !== 'boolean' || processed.has(id)) {
    throw new Error(`Configuração de lote inválida: ${id}`);
  }
  processed.add(id);
  const name = card.match(/<h3>([^<]+)<\/h3>/)?.[1];
  const price = card.match(/<p class="ticket-price">([\s\S]*?)<\/p>/)?.[1].replace(/<[^>]+>/g, '').trim();
  const actionPattern = /<(?:a|button)\b[^>]*class="button ticket-button"[^>]*>[\s\S]*?<\/(?:a|button)>/;
  if (!name || !price || !actionPattern.test(card) || !card.includes('class="ticket-status"')) {
    throw new Error(`Conteúdo de lote incompleto: ${id}`);
  }

  card = card.replace(/class="([^"]+)"/, (_, classes) => {
    const clean = classes.split(/\s+/).filter(value => value !== 'ticket-locked');
    if (!lote.ativo) clean.push('ticket-locked');
    return `class="${clean.join(' ')}"`;
  });
  card = card.replace(/(<p class="ticket-status">)[\s\S]*?(<\/p>)/, `$1${lote.ativo ? 'DISPONÍVEL AGORA' : 'BLOQUEADO'}$2`);

  let action;
  if (lote.ativo) {
    const checkout = new URL(lote.checkout);
    if (checkout.protocol !== 'https:' || checkout.hostname !== 'pay.kiwify.com.br') {
      throw new Error(`Checkout inválido: ${id}`);
    }
    const label = escapeHtml(`Comprar ingresso do ${name} por ${price} na Kiwify, em nova aba`);
    action = `<a class="button ticket-button" href="${escapeHtml(lote.checkout)}" target="_blank" rel="noopener noreferrer" aria-label="${label}">Comprar ingresso <svg aria-hidden="true"><use href="#arrow-up-right"/></svg></a>`;
  } else {
    const label = escapeHtml(`${name}: lote bloqueado, aguardando liberação`);
    action = `<button type="button" class="button ticket-button" disabled aria-disabled="true" aria-label="${label}">Lote bloqueado <svg aria-hidden="true"><use href="#lock"/></svg></button>`;
  }
  return card.replace(actionPattern, action);
});

if (processed.size !== Object.keys(lotes).length) throw new Error('Nem todos os lotes foram encontrados no HTML.');
await writeFile(indexPath, updated);
console.log(`Lotes disponíveis: ${Object.keys(lotes).filter(id => lotes[id].ativo).join(', ') || 'nenhum'}`);
