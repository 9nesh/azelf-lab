import { buildConsumerAssets } from '../../scripts/consumer-assets.ts';
import { resolve } from 'node:path';
import { test,expect } from '@playwright/test';
import { vendorServer } from '../../apps/vendor-api/src/server.ts';
import { consumerServer } from '../../apps/consumer/src/server/server.ts';
import { listen,close } from '../../scripts/net.ts';
test('baseline filtering and explicit vendor failure over HTTP',async({page})=>{
 buildConsumerAssets('apps/consumer','.azelf/test-ui/app.js');const vendor=vendorServer('v1');const vendorUrl=await listen(vendor);const consumer=consumerServer(vendorUrl,'frozen-baseline','acceptance',resolve('.azelf/test-ui/app.js'));const url=await listen(consumer);
 try {await page.goto(url);await expect(page.locator('#count')).toHaveText('3');await expect(page.locator('#total')).toHaveText('$375.00');await expect(page.locator('#permits li')).toHaveCount(3);await page.getByLabel('Filter status').selectOption('approved');await expect(page.locator('#total')).toHaveText('$175.00');await expect(page.locator('#count')).toHaveText('2');await expect(page.locator('#permits')).toContainText('Solar Project');await expect(page.locator('#permits')).toContainText('Water Project');await page.getByLabel('Filter status').selectOption('pending');await expect(page.locator('#total')).toHaveText('$200.00');await expect(page.locator('#permits')).toContainText('Storage Project');await page.getByLabel('Filter status').selectOption('all');await expect(page.locator('#count')).toHaveText('3');await page.screenshot({path:'.azelf/baseline-browser.png',fullPage:true});await close(vendor);await page.getByRole('button',{name:'Run request again'}).click();await expect(page.getByRole('alert')).toContainText('Unable to load permits');await expect(page.locator('#results')).toBeHidden();}
 finally{await close(consumer);if(vendor.listening)await close(vendor);}
});
