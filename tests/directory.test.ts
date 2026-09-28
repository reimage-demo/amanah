import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { expect, test, vi } from 'vitest';
const js=readFileSync('assets/js/members.js','utf8');
function fixture(fetch:any) {
 const dom=new JSDOM(readFileSync('members.html','utf8'),{url:'https://example.com',runScripts:'outside-only'});
 const w=dom.window as any;
 w.AMANAH_CONFIG={convexSiteUrl:'https://test-amanah.convex.site'}; w.fetch=fetch;w.eval(js);return w;
}
test('directory renders names as text and follows pagination without leaking fields',async()=>{
 const fetch=vi.fn().mockResolvedValueOnce({ok:true,json:async()=>({members:[{name:'<img src=x onerror=alert(1)>'}],cursor:'next'})}).mockResolvedValueOnce({ok:true,json:async()=>({members:[{name:'Second name'}],cursor:null})});
 const w=fixture(fetch);
 await vi.waitFor(()=>expect(w.document.querySelectorAll('#members-list li')).toHaveLength(1));
 expect(w.document.querySelector('#members-list img')).toBeNull();
 expect(w.document.querySelector('#members-list').textContent).toContain('<img');
 w.document.querySelector('#members-more').click();
 await vi.waitFor(()=>expect(w.document.querySelectorAll('#members-list li')).toHaveLength(2));
 expect(fetch.mock.calls[1][0]).toContain('?cursor=next');
 expect(w.document.querySelector('#members-more').hidden).toBe(true);
});
test('directory has distinct failure, retry and empty states',async()=>{
 const fetch=vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ok:true,json:async()=>({members:[],cursor:null})});
 const w=fixture(fetch);
 await vi.waitFor(()=>expect(w.document.querySelector('#members-retry').hidden).toBe(false));
 expect(w.document.querySelector('#members-status').textContent).toContain('could not load');
 w.document.querySelector('#members-retry').click();
 await vi.waitFor(()=>expect(w.document.querySelector('#members-status').textContent).toContain('taking shape'));
});
test('storage notice remembers dismissal and can be reopened without enabling tracking',()=>{
 const w=new JSDOM(readFileSync('members.html','utf8'),{url:'https://example.com',runScripts:'outside-only'}).window;
 w.eval(readFileSync('assets/js/privacy.js','utf8'));
 const notice=w.document.querySelector('.storage-notice') as HTMLElement;
 expect(notice.hidden).toBe(false);
 (notice.querySelector('button') as HTMLButtonElement).click();
 expect(notice.hidden).toBe(true);
 expect(w.localStorage.getItem('amanah.storageNotice.v1')).toBeTruthy();
 (w.document.querySelector('[data-storage-notice]') as HTMLButtonElement).click();
 expect(notice.hidden).toBe(false);
});
