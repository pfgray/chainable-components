
type Dependency<A> = {
    _type: '@@ChainableComponentsDependency',
    value: A,
    equals: (l: A, r: A) => boolean
}

function isDep<T>(a: any): a is Dependency<T> {
    return a.type === '@@ChainableComponentsDependency'
}

type Dependencies = (any | Dependency<any>)[]

export function equals(l: Dependencies, r: Dependencies): boolean {
    return l.every((dep, i) => {
        const rightDep = r[i]
        if(isDep(dep)) {
            if(isDep(rightDep)) {
                return dep.equals(dep.value, rightDep.value)
            } else {
                return false;
            }
        } else {
            return dep === rightDep;
        }
    })
}

export function itemEquals(l: any, r: any): boolean {
    if(l && isDep(l) ) {
    }
    return l.equals(l.value, r.value)
}

export function depEquals<A>(l: Dependency<A>, r: Dependency<A>): boolean {
    return l.equals(l.value, r.value)
}
