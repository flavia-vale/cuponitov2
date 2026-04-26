# Diretrizes do projeto Cuponito v2

## Regras de CSS / Layout Mobile

### Nunca usar margem negativa para full-bleed em mobile
`-mx-4 px-4` (ou qualquer `-mx-*`) em containers com `overflow-x-auto` causa scroll horizontal
na página inteira no mobile, pois estende o elemento além do viewport.

**Errado:**
```jsx
<div className="flex overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
```

**Correto:**
```jsx
<div className="flex overflow-x-auto w-full">
```

### Sempre adicionar `overflow-x-hidden` no wrapper raiz das páginas
Toda página deve ter `overflow-x-hidden` no div raiz para blindar scroll horizontal:
```jsx
<div className="min-h-screen overflow-x-hidden bg-[#f5f3ef]">
```

### Aspect-ratio em cards deve escalar com breakpoints
Cards nunca devem ter aspect-ratio fixo — use versões menores no mobile e maiores no desktop:
```jsx
// Correto: escala progressiva
"aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/9] lg:aspect-[21/9]"

// Errado: ratio fixo que pode ser grande demais em mobile
"aspect-[16/9]"
```
