import { expect, test } from 'bun:test';
import { GetPaths, GetLayoutFile } from '../../router'; 

test("Get paths for /home/foo/bar", () => {
    expect(GetPaths("/home/foo/bar")).toEqual(["home/foo/bar", "home/foo", "home", ""])
})

test("Get paths for /", () => {
    expect(GetPaths("/")).toEqual([""])
})

test("Get layout file for tests /", async () => {
    const layout_file = await GetLayoutFile("/", "./src/tests/pages")
    expect(layout_file).toEqual("./src/tests/pages/layout.tsx")
})

test("Get layout file for tests /1deep/", async () => {
    const layout_file = await GetLayoutFile("/1deep/", "./src/tests/pages")
    expect(layout_file).toEqual("./src/tests/pages/1deep/layout.tsx")
})

test("Get layout file for tests /1deep/2deep", async () => {
    const layout_file = await GetLayoutFile("/1deep/2deep", "./src/tests/pages")
    expect(layout_file).toEqual("./src/tests/pages/1deep/layout.tsx")
})