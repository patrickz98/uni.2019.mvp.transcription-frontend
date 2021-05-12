/*
 * Javascript Diff Algorithm
 *    By John Resig (http://ejohn.org/)
 *    Modified by Chu Alan "sprite"
 *
 * Released under the MIT license.
 *
 * More Info:
 *    http://ejohn.org/projects/javascript-diff-algorithm/
 */
export function diffString(oldStr, newStr)
{
    if (oldStr === undefined)
    {
        oldStr = "";
    }

    if (newStr === undefined)
    {
        newStr = "";
    }

    var out = diff(oldStr === "" ? [] : oldStr.split(" "), newStr === "" ? [] : newStr.split(" "));
    var results = [];

    // console.debug("oldStr", oldStr);
    // console.debug("newStr", newStr);
    // console.debug("out", out);

    if (out.n.length === 0)
    {
        for (var inx = 0; inx < out.o.length; inx++)
        {
            results.push({
                word: out.o[inx],
                op: "del"
            });
        }

        return results;
    }

    if ((out.o[0] === undefined) || (out.o[0].text == null))
    // if (out.o[0].text == null)
    {
        for (var iny = 0; iny < out.o.length && out.o[iny].text == null; iny++)
        {
            results.push({
                word: out.o[iny],
                op: "del"
            });
        }
    }

    for (var inz = 0; inz < out.n.length; inz++)
    {
        if (out.n[inz].text == null)
        {
            results.push({
                word: out.n[inz],
                op: "ins"
            });
        } else
        {
            results.push(out.n[inz].text);

            for (var inq = out.n[inz].row + 1; inq < out.o.length && out.o[inq].text == null; inq++)
            {
                results.push({
                    word: out.o[inq],
                    op: "del"
                });
            }
        }
    }

    return results;
}

export function diff(o, n)
{
    var ns = {};
    var os = {};

    for (var inx = 0; inx < n.length; inx++)
    {
        if (ns[n[inx]] == null)
            ns[n[inx]] = { rows: [], o: null };
        ns[n[inx]].rows.push(inx);
    }

    for (var iny = 0; iny < o.length; iny++)
    {
        if (os[o[iny]] == null)
            os[o[iny]] = { rows: [], n: null };
        os[o[iny]].rows.push(iny);
    }

    for (var inz in ns)
    {
        if (ns[inz].rows.length === 1 && typeof (os[inz]) !== "undefined" && os[inz].rows.length === 1)
        {
            n[ns[inz].rows[0]] = { text: n[ns[inz].rows[0]], row: os[inz].rows[0] };
            o[os[inz].rows[0]] = { text: o[os[inz].rows[0]], row: ns[inz].rows[0] };
        }
    }

    for (var inq = 0; inq < n.length - 1; inq++)
    {
        if (n[inq].text != null && n[inq + 1].text == null && n[inq].row + 1 < o.length && o[n[inq].row + 1].text == null &&
            n[inq + 1] === o[n[inq].row + 1])
        {
            n[inq + 1] = { text: n[inq + 1], row: n[inq].row + 1 };
            o[n[inq].row + 1] = { text: o[n[inq].row + 1], row: inq + 1 };
        }
    }

    for (var ink = n.length - 1; ink > 0; ink--)
    {
        if (n[ink].text != null && n[ink - 1].text == null && n[ink].row > 0 && o[n[ink].row - 1].text == null &&
            n[ink - 1] === o[n[ink].row - 1])
        {
            n[ink - 1] = { text: n[ink - 1], row: n[ink].row - 1 };
            o[n[ink].row - 1] = { text: o[n[ink].row - 1], row: ink - 1 };
        }
    }

    return { o: o, n: n };
}

