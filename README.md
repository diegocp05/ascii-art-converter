<h1 align="center"> ASCII Art Converter </h1>

<p align="center">
<img src="https://img.shields.io/github/issues/diegocp05/ascii-converter"/>
<img src="https://img.shields.io/github/forks/diegocp05/ascii-converter"/>
<img src="https://img.shields.io/github/stars/diegocp05/ascii-converter"/>
<img src="https://img.shields.io/github/license/diegocp05/ascii-converter"/>
</p>

<p align="center">Um componente React interativo que transforma qualquer imagem em arte ASCII. Faça upload, ajuste as configurações em tempo real e copie ou baixe sua criação. Construído com TypeScript, React Hooks e shadcn/ui.</p>

<h1 align="center">
  <img height="400" alt="Código caindo no estilo Matrix" title="ASCII Art Converter" src="https://media.giphy.com/media/AOSwwqVjNZlDO/giphy.gif"/>
</h1>

## 🌟 Funcionalidades

### 🖼️ Upload Intuitivo e Conversão
- **Drag & Drop**: Arraste e solte arquivos de imagem diretamente na interface.
- **Seleção de Arquivo**: Botão de upload tradicional para selecionar imagens.
- **Notificações**: Feedback instantâneo sobre sucesso ou erro no upload usando o hook `useToast`.
- **Conversão em Tempo Real**: A arte ASCII é gerada instantaneamente no cliente usando a API de Canvas.

---

### ⚙️ Controles de Personalização
- **Resolução**: Ajuste a "largura" da arte ASCII com um slider para mais ou menos detalhes.
- **Conjunto de Caracteres**: Escolha entre 4 estilos (Padrão, Detalhado, Blocos, Minimalista).
- **Inverter Cores**: Alterne o mapeamento de brilho (pixels claros viram caracteres escuros, e vice-versa).
- **Modo de Cor**: Visualize a arte em escala de cinza (texto puro) ou com as cores RGB originais da imagem.

---

### 📋 Exportação Fácil
- **Copiar para Clipboard**: Copia a arte ASCII (em escala de cinza) para a área de transferência com um clique.
- **Download**: Baixa a arte ASCII (em escala de cinza) como um arquivo `.txt`.

