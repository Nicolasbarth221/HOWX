# 🌱 EcoAlerta Floripa

**MVP Web do EcoAlerta Floripa** - Um site simples e acessível para nunca mais perder o dia da coleta de lixo!

---

## 📋 O que é este projeto?

EcoAlerta Floripa é um **MVP (Produto Mínimo Viável)** web estático que ajuda moradores de Florianópolis a:

- 📅 **Saber o próximo dia/horário da coleta de lixo** no seu bairro
- ⏰ **Receber lembretes** quando estiver na véspera da coleta
- 📢 **Reportar problemas** com a coleta (em 3 cliques!)
- 📖 **Consultar um guia** de descarte correto de materiais
- 📋 **Ver histórico** de reportes feitos

**Características técnicas:**
- ✅ HTML, CSS e JavaScript puros (sem frameworks)
- ✅ Sem build, sem bundlers, sem dependências externas
- ✅ Responsivo (mobile-first)
- ✅ Acessível (ARIA labels, contraste adequado, foco visível)
- ✅ Dados salvos localmente no navegador (LocalStorage)
- ✅ Testes unitários incluídos

---

## 🚀 Como rodar localmente

### Opção 1: Abrir diretamente no navegador

1. Clone ou baixe este repositório
2. Navegue até a pasta do projeto
3. **Abra o arquivo `index.html` no seu navegador** (duplo clique ou arraste para o navegador)
4. Pronto! O site está funcionando 🎉

### Opção 2: Usar um servidor local (recomendado)

Se preferir, você pode usar um servidor HTTP local:

**Com Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Com Node.js:**
```bash
npx http-server -p 8000
```

**Com VS Code:**
- Instale a extensão "Live Server"
- Clique com botão direito em `index.html` → "Open with Live Server"

Depois acesse: `http://localhost:8000`

---

## 🌐 Como publicar no GitHub Pages

1. Faça commit e push de todos os arquivos para o GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - EcoAlerta Floripa MVP"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/ecoalerta-web.git
   git push -u origin main
   ```

2. No repositório do GitHub, vá em **Settings** → **Pages**

3. Em **Source**, selecione:
   - **Branch:** `main`
   - **Folder:** `/ (root)`

4. Clique em **Save**

5. Aguarde alguns minutos e seu site estará disponível em:
   ```
   https://SEU-USUARIO.github.io/ecoalerta-web/
   ```

---

## 📁 Estrutura de arquivos

```
ecoalerta-web/
├── index.html          # Home - próxima coleta
├── config.html         # Configurar bairro e horários
├── report.html         # Reportar ocorrências
├── guide.html          # Guia de descarte pesquisável
├── history.html        # Histórico de reportes
├── tests.html          # Página de testes unitários
├── style.css           # Estilos (mobile-first)
├── app.js              # Lógica principal (funções puras)
├── tests.js            # Testes unitários
├── calendar.json       # Dados dos bairros e horários
├── guide.json          # Guia de descarte de materiais
└── README.md           # Este arquivo
```

---

## 💾 Onde ficam os dados?

Todos os dados são salvos **localmente no seu navegador** usando `LocalStorage`:

- **`localStorage.ecoalerta.config`** → Configuração do bairro e dias de coleta
- **`localStorage.ecoalerta.reports`** → Histórico de reportes

**⚠️ Importante:**
- Os dados não são sincronizados entre dispositivos
- Se limpar os dados do navegador, as configurações serão perdidas
- Não há backend - tudo funciona offline após o primeiro carregamento

---

## 🧪 Como executar os testes

1. Abra o arquivo **`tests.html`** no navegador
2. Os testes serão executados automaticamente
3. Veja os resultados na página (✅ = passou, ❌ = falhou)
4. Abra o Console do navegador (F12) para ver detalhes

**Testes incluídos:**
- ✅ Conversão de dias da semana
- ✅ Cálculo de próxima coleta (diversos cenários)
- ✅ Detecção de véspera de coleta
- ✅ Geração de protocolos de reporte
- ✅ Formatação de tempo restante
- ✅ Persistência de configuração

---

## 🎯 Funcionalidades principais

### 1️⃣ Configurar coleta
- Selecione seu bairro
- Escolha os dias/horários da coleta
- Dados salvos automaticamente

### 2️⃣ Ver próxima coleta
- Veja quando será a próxima coleta
- Veja quanto tempo falta
- Receba lembrete na véspera (banner automático)

### 3️⃣ Reportar problemas
- Escolha o motivo (3 opções)
- Adicione observações (opcional)
- Gere protocolo local para referência

### 4️⃣ Consultar guia de descarte
- Busca em tempo real
- Orientações sobre como descartar cada tipo de material
- Dicas e observações importantes

### 5️⃣ Ver histórico
- Lista todos os reportes feitos
- Exportar histórico como JSON
- Limpar histórico (com confirmação)

---

## 🏘️ Bairros disponíveis

O sistema vem pré-configurado com os seguintes bairros de exemplo:

- **Trindade:** 2ª e 5ª às 07:00
- **Centro:** 3ª e 6ª às 07:00
- **Campeche:** 4ª e Sábado às 07:00
- **Lagoa da Conceição:** 2ª e 5ª às 08:00
- **Ingleses:** 3ª e 6ª às 08:00
- **Canasvieiras:** 4ª e Sábado às 07:30

Para adicionar ou modificar bairros, edite o arquivo **`calendar.json`**.

---

## 🎨 Personalização

### Adicionar novos bairros

Edite `calendar.json`:
```json
{
  "Novo Bairro": ["2ª 07:00", "5ª 07:00"]
}
```

### Adicionar materiais ao guia

Edite `guide.json`:
```json
{
  "material": "Pilhas",
  "comoDescartar": "Levar a ponto de coleta específico",
  "observacoes": "Nunca descartar no lixo comum"
}
```

### Alterar cores

Edite as variáveis CSS em `style.css`:
```css
:root {
  --primary-color: #2ecc71;  /* Verde principal */
  --secondary-color: #3498db; /* Azul */
  /* ... outras cores ... */
}
```

---

## ✅ Validação com usuários

Para validar este MVP, siga estas sugestões:

### Perguntas para usuários (5-10 pessoas):

1. **Clareza:** "Ficou claro qual é o próximo dia de coleta no seu bairro?" (Nota 1-5)
2. **Facilidade:** "Conseguiu reportar um problema em 3 cliques?" (Nota 1-5)
3. **Utilidade:** "Você usaria este site no dia a dia?" (Sim/Não)
4. **Design:** "O design é agradável e fácil de usar?" (Nota 1-5)
5. **Melhorias:** "O que você mudaria ou adicionaria?"

### Como aplicar:

1. Mostre o site funcionando (pode ser pelo celular)
2. Peça para a pessoa navegar livremente por 2-3 minutos
3. Faça as perguntas acima
4. Anote as respostas e comentários

### Resultados esperados:

- **Notas médias acima de 4.0** = ótimo!
- **Notas médias entre 3.0-4.0** = bom, mas há espaço para melhorias
- **Notas abaixo de 3.0** = revisar funcionalidade

**📝 Documente os resultados no seu PDF final da disciplina!**

---

## 📱 Compatibilidade

Testado e funcionando em:

- ✅ Chrome/Edge (desktop e mobile)
- ✅ Firefox (desktop e mobile)
- ✅ Safari (desktop e mobile)
- ✅ Navegadores modernos com suporte a ES6+

**Requisitos mínimos:**
- JavaScript habilitado
- LocalStorage habilitado
- Navegador moderno (últimos 2 anos)

---

## 🐛 Troubleshooting

### Os dados não são salvos
- Verifique se o JavaScript está habilitado
- Verifique se o LocalStorage não está bloqueado
- Não use modo anônimo/privado do navegador

### A próxima coleta não aparece
- Certifique-se de que configurou um bairro
- Verifique se selecionou pelo menos um dia de coleta
- Abra o Console (F12) para ver possíveis erros

### Testes estão falhando
- Certifique-se de que está executando `tests.html` (não `tests.js` diretamente)
- Limpe o cache do navegador e recarregue
- Verifique se `app.js` está carregando corretamente

---

## 🤝 Contribuindo

Este é um projeto acadêmico/MVP, mas contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

## 👥 Autor

Desenvolvido como MVP demonstrativo para o projeto EcoAlerta Floripa.

---

## 📞 Suporte

- 📧 Para dúvidas sobre o código, abra uma [Issue no GitHub]
- 💡 Para sugestões, abra uma [Discussion no GitHub]

---

## 🎓 Uso Acadêmico

Este projeto pode ser usado como referência para:
- Desenvolvimento web sem frameworks
- TDD (Test-Driven Development) básico
- Boas práticas de acessibilidade
- Design responsivo mobile-first
- Persistência com LocalStorage
- Validação de MVPs

---

**Feito com 💚 para Florianópolis**

🌱 EcoAlerta Floripa - Juntos por uma cidade mais limpa e sustentável!

