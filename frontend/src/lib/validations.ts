export const validateCategoryName = (name: string) => {
    if (!name.trim()) return "El nombre es obligatorio.";
    if (name.length < 3) return "Debe tener al menos 3 caracteres.";
    if (!/^[a-zA-Z0-9\s]+$/.test(name)) return "Solo letras, números y espacios.";
    return null;
};
