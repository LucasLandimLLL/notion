function stringToColor(srt: string) {
    let hash = 0;
    for (let i = 0; i < srt.length; i++) {
        hash = srt.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "000000".substring(0, 6 - c.length) + c;
}

export default stringToColor;
