# Chance

You can use any of the random functions listed below from
[chance](https://chancejs.com) as [generators](../generator/).

The arguments you provide will be forwarded to the underlying
<a href="https://chancejs.com/" target="_blank">chance</a> method.

Let's use <a href="https://chancejs.com/text/sentence.html" target="_blank">sentence</a> as an example:

```js#evaluate:false
const { sentence } = require('chance-generators');
```

```js
expect(sentence.take(3), "to equal", [
  "Gotsalda kodtac ewegute bibro celel taj sibsof buunu bave dolbaw gokim sab ziwiwwuh gib.",
  "Log sezsi ju bu mahbu wot cujduvtih le votevned esohogbi dadeip riide rohu jod tuhdulhak retijic ti luh.",
  "Ril dej fef wijug howeju tu caku vapiz soze wu tumit ede."
]);
```

You can specify how many words the sentence should have. This option will just
be forwarded to the underlying <a href="https://chancejs.com/text/sentence.html" target="_blank">sentence</a>
method:

```js
expect(sentence({ words: 4 }).take(3), "to equal", [
  "Ofosid daej wocu ofaufjom.",
  "Be mabuj do lisib.",
  "Valbuunu bave dolbaw gokim."
]);
```

It is even possible to transform the generated values using
[map](../generator/#map-mapper-) method.

```js
expect(
  sentence({ words: 4 })
    .map(s => s.toUpperCase())
    .take(3),
  "to equal",
  ["OFOSID DAEJ WOCU OFAUFJOM.", "BE MABUJ DO LISIB.", "VALBUUNU BAVE DOLBAW GOKIM."]
);
```

## Basics

* <a href="https://chancejs.com/basics/letter.html" target="_blank">letter</a>

## Text

* <a href="https://chancejs.com/text/paragraph.html" target="_blank">paragraph</a>
* <a href="https://chancejs.com/text/sentence.html" target="_blank">sentence</a>
* <a href="https://chancejs.com/text/syllable.html" target="_blank">syllable</a>
* <a href="https://chancejs.com/text/word.html" target="_blank">word</a>

## Person

* <a href="https://chancejs.com/person/age.html" target="_blank">age</a>
* <a href="https://chancejs.com/person/birthday.html" target="_blank">birthday</a>
* <a href="https://chancejs.com/person/cf.html" target="_blank">cf</a>
* <a href="https://chancejs.com/person/cpf.html" target="_blank">cpf</a>
* <a href="https://chancejs.com/person/first.html" target="_blank">first</a>
* <a href="https://chancejs.com/person/gender.html" target="_blank">gender</a>
* <a href="https://chancejs.com/person/last.html" target="_blank">last</a>
* <a href="https://chancejs.com/person/name.html" target="_blank">name</a>
* <a href="https://chancejs.com/person/prefix.html" target="_blank">prefix</a>
* <a href="https://chancejs.com/person/ssn.html" target="_blank">ssn</a>
* <a href="https://chancejs.com/person/suffix.html" target="_blank">suffix</a>

## Thing

* <a href="https://chancejs.com/thing/animal.html" target="_blank">animal</a>

## Mobile

* <a href="https://chancejs.com/mobile/android_id.html" target="_blank">android_id</a>
* <a href="https://chancejs.com/mobile/apple_token.html" target="_blank">apple_token</a>
* <a href="https://chancejs.com/mobile/bb_pin.html" target="_blank">bb_pin</a>
* <a href="https://chancejs.com/mobile/wp7_anid.html" target="_blank">wp7_anid</a>
* <a href="https://chancejs.com/mobile/wp8_anid2.html" target="_blank">wp8_anid2</a>

## Web

* <a href="https://chancejs.com/web/avatar.html" target="_blank">avatar</a>
* <a href="https://chancejs.com/web/color.html" target="_blank">color</a>
* <a href="https://chancejs.com/web/company.html" target="_blank">company</a>
* <a href="https://chancejs.com/web/domain.html" target="_blank">domain</a>
* <a href="https://chancejs.com/web/email.html" target="_blank">email</a>
* <a href="https://chancejs.com/web/fbid.html" target="_blank">fbid</a>
* <a href="https://chancejs.com/web/google_analytics.html" target="_blank">google_analytics</a>
* <a href="https://chancejs.com/web/hashtag.html" target="_blank">hashtag</a>
* <a href="https://chancejs.com/web/ip.html" target="_blank">ip</a>
* <a href="https://chancejs.com/web/ipv6.html" target="_blank">ipv6</a>
* <a href="https://chancejs.com/web/klout.html" target="_blank">klout</a>
* <a href="https://chancejs.com/web/profession.html" target="_blank">profession</a>
* <a href="https://chancejs.com/web/tld.html" target="_blank">tld</a>
* <a href="https://chancejs.com/web/twitter.html" target="_blank">twitter</a>
* <a href="https://chancejs.com/web/url.html" target="_blank">url</a>

## Location

* <a href="https://chancejs.com/location/address.html" target="_blank">address</a>
* <a href="https://chancejs.com/location/altitude.html" target="_blank">altitude</a>
* <a href="https://chancejs.com/location/areacode.html" target="_blank">areacode</a>
* <a href="https://chancejs.com/location/city.html" target="_blank">city</a>
* <a href="https://chancejs.com/location/coordinates.html" target="_blank">coordinates</a>
* <a href="https://chancejs.com/location/country.html" target="_blank">country</a>
* <a href="https://chancejs.com/location/depth.html" target="_blank">depth</a>
* <a href="https://chancejs.com/location/geohash.html" target="_blank">geohash</a>
* <a href="https://chancejs.com/location/latitude.html" target="_blank">latitude</a>
* <a href="https://chancejs.com/location/longitude.html" target="_blank">longitude</a>
* <a href="https://chancejs.com/location/phone.html" target="_blank">phone</a>
* <a href="https://chancejs.com/location/postal.html" target="_blank">postal</a>
* <a href="https://chancejs.com/location/province.html" target="_blank">province</a>
* <a href="https://chancejs.com/location/state.html" target="_blank">state</a>
* <a href="https://chancejs.com/location/street.html" target="_blank">street</a>
* <a href="https://chancejs.com/location/zip.html" target="_blank">zip</a>

## Time

* <a href="https://chancejs.com/time/ampm.html" target="_blank">ampm</a>
* <a href="https://chancejs.com/time/date.html" target="_blank">date</a>
* <a href="https://chancejs.com/time/hammertime.html" target="_blank">hammertime</a>
* <a href="https://chancejs.com/time/hour.html" target="_blank">hour</a>
* <a href="https://chancejs.com/time/millisecond.html" target="_blank">millisecond</a>
* <a href="https://chancejs.com/time/minute.html" target="_blank">minute</a>
* <a href="https://chancejs.com/time/month.html" target="_blank">month</a>
* <a href="https://chancejs.com/time/second.html" target="_blank">second</a>
* <a href="https://chancejs.com/time/timestamp.html" target="_blank">timestamp</a>
* <a href="https://chancejs.com/time/timezone.html" target="_blank">timezone</a>
* <a href="https://chancejs.com/time/weekday.html" target="_blank">weekday</a>
* <a href="https://chancejs.com/time/year.html" target="_blank">year</a>

## Finance

* <a href="https://chancejs.com/finance/cc.html" target="_blank">cc</a>
* <a href="https://chancejs.com/finance/cc_type.html" target="_blank">cc_type</a>
* <a href="https://chancejs.com/finance/currency.html" target="_blank">currency</a>
* <a href="https://chancejs.com/finance/currency_pair.html" target="_blank">currency_pair</a>
* <a href="https://chancejs.com/finance/dollar.html" target="_blank">dollar</a>
* <a href="https://chancejs.com/finance/euro.html" target="_blank">euro</a>
* <a href="https://chancejs.com/finance/exp.html" target="_blank">exp</a>
* <a href="https://chancejs.com/finance/exp_month.html" target="_blank">exp_month</a>
* <a href="https://chancejs.com/finance/exp_year.html" target="_blank">exp_year</a>

## Miscellaneous

* <a href="https://chancejs.com/miscellaneous/coin.html" target="_blank">coin</a>
* <a href="https://chancejs.com/miscellaneous/dice.html" target="_blank">dice</a>
* <a href="https://chancejs.com/miscellaneous/guid.html" target="_blank">guid</a>
* <a href="https://chancejs.com/miscellaneous/hash.html" target="_blank">hash</a>
* <a href="https://chancejs.com/miscellaneous/radio.html" target="_blank">radio</a>
* <a href="https://chancejs.com/miscellaneous/rpg.html" target="_blank">rpg</a>
* <a href="https://chancejs.com/miscellaneous/tv.html" target="_blank">tv</a>
