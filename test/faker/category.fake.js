exports.fakeCategoryData = {
    name: 'Electronica',
    icon: 'tools',
    color: '#404040'
}

exports.validateNotEmpty = (received) => {
    expect(received).not.toBeNull();
    expect(received).not.toBeUndefined();
    expect(received).toBeTruthy();
}

exports.validateStringEquality = (received, expected) => {
    expect(received).not.toEqual('Electron');
    expect(received).toEqual(expected);
}