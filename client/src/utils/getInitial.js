export const getInitial = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    const initials = parts.map((part) => part[0].toUpperCase()).join("");
    return initials.slice(0, 2); 
};