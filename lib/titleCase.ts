export default function (value: string) {
    const arr = value.split(' ')
    let titleCased = ''
    const ignoreList = ['of', 'the', 'a', 'an']
    for (let i = 0; i < arr.length; i++) {
        let word = arr[i]
        if (ignoreList.includes(word) && i > 0 ) continue
        word = word.toLowerCase()
        word = word[0].toUpperCase() + word.slice(1,)
        titleCased += word + " "
    }
    return titleCased.trimEnd()
}