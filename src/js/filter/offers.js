import filterList from "../classes/filterList";

class Offers extends filterList {
    constructor(properties) {
        super(properties)

        this.promosDetails = properties.promosDetails || {}
        const { offerDeals, specialOffers } = this.promosDetails
        this.offerDeals = offerDeals // console.log(this.offerDeals);
        this.specialOffers = specialOffers // console.log(this.specialOffers);

        // DEALS
        this.offersVisiblePaxType = this.getVisiblePaxType() // console.log(this.offersVisiblePaxType);
        // DISCOUNT
        this.offersEnabledFareType = this.getEnabledFareType() // console.log(this.offersEnabled);

        this.ribbons = this.joinRibbons()
        // console.log(this.ribbons);

        this.getButtonsHtmlJson.bind(this)
        // this.getEnabledOffers.bind(this)
    }

    getButtonsHtmlJson(options) {
        return this.ribbons.map(opt => {
            return {
                tagName: "button",
                attrs: {
                    class: "cc-fe_srp cc-fe_srp-filters__action-value",
                    value: opt.code || '',
                },
                content: opt.name || '',
            }
        })
    }

    joinRibbons() {
        // const updates = Object.fromEntries(this.offersEnabledFareType.map(o => [o.name, o])),
        //     result = this.offersVisiblePaxType.map(o => updates[o.name] || o);
        const result = this.offersVisiblePaxType.concat(this.offersEnabledFareType)

        return result
    }

    getEnabledFareType() {
        // console.log(this.options); console.log(this.specialOffers);
        let filtered = []
        this.options.filter(opt => {
            if (opt.enabled && this.specialOffers.hasOwnProperty(opt.code)) {
                const item = this.specialOffers[opt.code] // console.log(item.endDate);
                let stringDate = '' != item.endDate ? item.endDate : (d => new Date(d.setDate(d.getDate() - 1)))(new Date).toDateString() // console.log(stringDate); console.log(new Date(stringDate).getTime()); console.log(new Date().getTime());
                if (Number(new Date(stringDate).getTime()) > Number(new Date().getTime()) && 'ribbon' == item.type) { // console.log('Pass'); // console.log(opt);
                    filtered.push(opt)
                }
            }
        }) // let newEl = this.options.filter(opt => opt.enabled && specialOffers.hasOwnProperty(opt.code)).map(value => { value }) // console.log('Enabled by f: ' + JSON.stringify(filtered));

        return filtered // console.log(filtered)
    }

    getVisiblePaxType() {
        // console.log(this.offerDeals);
        let filtered = []
        Object.keys(this.offerDeals).filter(key => { // onsole.log(this.offerDeals[key]);
            
            if (!this.offerDeals[key]['disabledForSearch'] && '' != this.offerDeals[key]['persuasiveBadge']) {
                let newEl = Object.assign(this.offerDeals[key], {}) // console.log(newEl); // console.log('I have to push');
                filtered.push(newEl)
            }
        })

        return filtered
    }
}

export default Offers