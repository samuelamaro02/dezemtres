# Dez em Três Experience

Site do evento em HTML, CSS e JavaScript, com fontes e imagens locais.

## Estrutura

- `dist/index.html`: conteúdo, navegação e diálogos acessíveis.
- `dist/styles.css`: identidade visual, layouts responsivos e estilos de impressão.
- `dist/app.js`: agenda, filtros, apresentações, menu e compartilhamento.
- `config/lotes.mjs`: ativação manual e checkout de cada lote.
- `dist/assets/`: fotos, anúncios oficiais, logo e fontes.

## Programação

A agenda foi adaptada do cronograma fornecido pela organização. Etapas internas, condições comerciais em planejamento e checklists operacionais não fazem parte do conteúdo do site.

## Informações pendentes

O evento está confirmado para 12/12/2026, das 08h às 18h, no Eco Business Center, R. Antônio Rabelo Júnior, 161, Miramar, João Pessoa – PB, CEP 58032-090. A associação entre palestrantes e horários e os detalhes das 16h às 18h ainda precisam ser confirmados. Esses detalhes da programação aparecem como informações a confirmar. O mapa integrado e os links de rota usam o endereço fornecido pela organização.

## Ingressos

Os botões de participação levam à seção de ingressos. Apenas o **Lote Fundador está ativo**. Os demais continuam visíveis, com botão desabilitado e sem link de compra no conteúdo da página.

Para liberar ou bloquear um lote, altere seu campo `ativo` em `config/lotes.mjs` para `true` ou `false`, execute `node scripts/prepare-lotes.mjs` e publique a atualização do site. A alteração vale para todos os visitantes após a publicação; não depende do navegador do organizador. Não há liberação automática por horário ou vendas. O bloqueio é aplicado ao HTML publicado e funciona também sem JavaScript; os checkouts inativos não são incluídos na página.

Essa configuração controla a exibição no site; não altera o cadastro ou o funcionamento dos produtos na Kiwify. Os checkouts são preservados na configuração para liberações futuras.

| Lote | Quantidade prevista | Preço por ingresso | Checkout |
| --- | ---: | ---: | --- |
| Lote Fundador | 5 | R$ 197,00 | https://pay.kiwify.com.br/kQuCFpS |
| Lote 1 — Antecipado | 8 | R$ 227,00 | https://pay.kiwify.com.br/q43ASxv |
| Lote 2 — Experiência | 12 | R$ 267,00 | https://pay.kiwify.com.br/U68tT2t |
| Lote Final | 15 | R$ 297,00 | https://pay.kiwify.com.br/XSlRVF7 |

As quantidades são o total previsto por lote, informado pelo organizador. O site não calcula estoque restante; a disponibilidade é confirmada no checkout.

Lucas Nicácio é o idealizador do evento, com destaque na abertura e em uma seção própria antes dos convidados. Régis Neto e Vinícius de Morais são os palestrantes confirmados. As participações ainda não reveladas não aparecem no carrossel. Os blocos da tarde na programação não exibem silhuetas. O carrossel reúne apenas Régis Neto, Vinícius de Morais e Lucas Nicácio, com setas, teclado e deslize no celular, sem rotação automática. Nenhuma biografia ou associação dos nomes confirmados a horários foi presumida.

## Verificação

- Sintaxe do JavaScript verificada com `node --check dist/app.js`.
- Navegação, menu em celular, filtros da manhã, tarde e dia completo, apresentações e dúvidas frequentes verificados no navegador.
- Layout em largura de celular inspecionado sem rolagem horizontal.

## Hospedagem

O conteúdo é estático, sem dependências de execução ou etapa de build. A configuração está em `.openai/hosting.json`.

## Meta Pixel e Conversions API

O site envia somente `PageView`. O Pixel roda no navegador e a rota `api/pageview.js` envia o mesmo evento pela Conversions API, usando o mesmo `event_id` para deduplicação. O token é lido apenas no servidor.

Configure estas variáveis no ambiente da Vercel (Production, Preview e Development conforme necessário):

- `PIXEL_META`: ID do Pixel/dataset.
- `TOKEN_META_API`: token de acesso da Conversions API; mantenha-o como variável secreta.
- `META_GRAPH_API_VERSION`: opcional; versão da Graph API, por padrão `v25.0`.

O arquivo `.env` local não deve ser publicado nem versionado. O endpoint retorna `503` quando as credenciais não estão configuradas; nesse caso, o Pixel do navegador continua ativo.
