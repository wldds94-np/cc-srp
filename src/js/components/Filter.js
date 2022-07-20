import ccObject from "../abstract/ccObject"

class Filter extends ccObject {

    constructor(props) {
        super(props)
        // this.props = Object.assign(props, {}) // console.log(props);
        this.type = this.saveSafePropertyProps(this.props, 'filterAPIKey')


        this.props = {
            ...this.props,
            tagName: this.saveSafePropertyProps(this.props, 'tagName', 'button'), // tagName || 'button',
            filterAPIKey: this.type, // filterAPIKey || '',
            filterTagKey: this.saveSafePropertyProps(this.props, 'filterTagKey'), // filterTagKey || '',
            filterTitleDesktop: this.saveSafePropertyProps(this.props, 'filterTitleDesktop'), // filterTitleDesktop || '',
            // The real filter with PLACEHOLDER {{ $i }}
            realFilterTagKey: this.saveSafePropertyProps(this.props, 'realFilterTagKey', false), // filterTagKey || '',
            // selected: props.selected || false
            default: this.saveSafePropertyProps(this.props, 'default', this.props.filterTitleDesktop)
        } // console.log(this.state);

        const subtypeProps = this.saveSafePropertyProps(this.props, 'subtypeProps', false)
        if (false != subtypeProps) {
            this.subtype = subtypeProps
        } else {
            let newSubtype = []
            newSubtype[this.type] = {
                filterTagKey: this.props.filterTagKey, // '{!tag=offerTag}fareType={cc*\w+*cc}'
                filterTagValue: '{cc*filterSearch*cc}',
                regex: /\{cc\*filterSearch\*cc\}/,
                indexTag: false,
            }
            this.subtype = newSubtype
        }
        // this.subtype = {
        //     fare: {
        // filterTagKey: '{!tag=offerTag}fareType', // '{!tag=offerTag}fareType={cc*\w+*cc}'
        // filterTagValue: '{cc*\w+*cc}',
        // },
        // discount: {
        //     filterTagKey: '{!tag=offerTag}campaignId_EUR_{cc*\w+*cc}', // '{!tag=offerTag}campaignId_EUR_{cc*\w+*cc}=anonymous'
        //     filterTagValue: 'anonymous',
        // },
        // }

        this.config = {
            ...this.config,
            hasCounter: true,
            contentContainer: this.config.baseStyleClass + ' ' + this.config.baseStyleClass + "-filters__action-label " + this.props.filterAPIKey,
            contentContainerSelector: "." + this.config.baseStyleClass + "-filters__action-label." + this.props.filterAPIKey,
            selectedStyleClass: 'selected',
            disabledStyleClass: 'disabled',
            valorisedStyleClass: 'valorised',
            // enabledStyleClass: 'enabled',
            domInstanceSelector: `#${this.config.baseStyleClass}-${this.type}`,
            labelSeparator: props.hasOwnProperty('labelSeparator') ? props.labelSeparator : ','
        }


        // this.state = {
        //     label: this.saveSafePropertyProps(this.props, 'label', this.props.default),
        //     search: this.saveSafePropertyProps(this.props, 'search', ''),
        //     openPing: false, // Set by Setup after inject HTML in the DOM
        // }
        this.state = {
            label: this.saveSafePropertyProps(this.props, 'label', this.props.default),
            search: this.saveSafePropertyProps(this.props, 'search', []),
            valorised: this.saveSafePropertyProps(this.props, 'valorised', false),
            // search: this.saveSafePropertyProps(this.props, 'search', ''),
            openPing: false, // Set by Setup after inject HTML in the DOM
        }

        // Set the callbacks Routing
        this.callbacks = {
            Router: {
                pingRequest: this.saveSafePropertyProps(props, 'onSaveChoice', (...args) => { return }),
            }
        }

        this.applyTransformContent = content => content

        // console.log(this)
    }

    isValorised() {
        const searchKey = Object.keys(this.state.search)
        console.log(searchKey); // console.log(searchKey);
        const res =  Boolean(searchKey.length) && searchKey.reduce((prev, next) => {
            console.log(this.state.search[next]);
            return prev && Boolean(this.state.search[next].length)
        }, true) // 
        console.log(res);
        // const res = searchKey.reduce((prev, next) => {
        //     return prev && Boolean(this.state.search[next].length)
        // }, true) // console.log(res);
        return res

    }

    registerChoice(content = '', search = []/* , subtypeKey = this.type */) {
        console.log(this);
        console.log(content, search);
        // console.log('You clicked ByList with value: ' + search + ' --- Content: ', content); // console.log('RegisterChoice');

        this.state.label = content
        this.state.search = search // console.log(this); // console.log(subtypeKey); // console.log(this.subtype) // console.log(this.subtype[subtypeKey]);
        this.updatingBeforeInjectContent()

        // I HAVE TO USE A PRE STRUCTURE STRING FOR ANY FILTER - duration / offers ecc.
        // const filterTag = false != this.props.realFilterTagKey ? this.props.realFilterTagKey : this.props.filterTagKey

        if (this.state.openPing) {
            let newQueryValues = []
            Object.keys(this.subtype).map(typeKey => {
                console.log(typeKey);

                let queryObject = this.subtype[typeKey]
                const { filterTagKey, filterTagValue, regex } = queryObject
                // I HAVE TO SEND THE REQUEST WITH THE REGEX
                const newSearchAttachedValue = this.generateSrcStringParam(this.state.search[typeKey])
                newQueryValues.push({
                    queryTag: filterTagKey.replace(regex, newSearchAttachedValue),
                    queryValue: filterTagValue.replace(regex, newSearchAttachedValue),
                    indexTag: this.subtype[typeKey].indexTag,
                })
            })
            this.callbacks.Router.pingRequest(newQueryValues)
        }
    }

    updateState(newContent = '', newSearch = []) {
        const { label, search } = this.state
        // console.log(this); // console.log(label); console.log(search); console.log(newContent); console.log(newSearch); 
        // console.log(newSearch == search); console.log(label == newContent);

        // RETURN IF IT'S EQUAL - Otherwise -> Loop
        if (this.arrayEquals(newSearch, search) && label == newContent) { // console.log('FILTER LABEL - NOT UPDATE RETURN - Nothing to UPDATE');
            return
        } else { // console.log('FILTER LABEL - UPDATE RETURN - I have to UPDATE');
            this.registerChoice(newContent, newSearch)
        }
    }

    saveChoices(callback = el => el) {
        console.log('Saving Choices...');
    }

    updatingBeforeInjectContent() {
        console.log('Update Content');
        let newContent = '' // console.log(this.state.label);
        if (this.state.label.length) {
            newContent += this.state.label
        } else {
            newContent += this.getDefault() // this.state.defaultContent // this.state.filterTitleDesktop
        }
        this.injectContent(this.applyTransformContent(newContent))
    
        this.updateValorised()
        
    }

    updateValorised() {
        const { valorisedStyleClass } = this.config
        // console.log('Set Content');
        let thisButton = this.getDomInstance(this.config.domInstanceSelector)
        this.state.valorised = Boolean(this.isValorised()) ? true : false 
        if (null != thisButton) {
            console.log(thisButton);
            if (this.state.valorised) {
                thisButton.classList.add(valorisedStyleClass)
            } else {
                thisButton.classList.remove(valorisedStyleClass)
            }
        }
        
    }

    injectContent(newContent) {
        const { contentContainerSelector } = this.config
        // console.log('Set Content');
        let thisButton = this.getDomInstance(this.config.domInstanceSelector) //  this.getDomInstance(this.config.domInstanceSelector)
        console.log(thisButton);
        let contentNode = null != thisButton ? thisButton.querySelector(contentContainerSelector) : null
        console.log(contentNode); // console.log(contentContainer); // contentContainer.textContent = newContent
        // on Start non è nel DOM
        if (null != contentNode) {
            contentNode.textContent = newContent
        }
    }

    getDefault(content = this.props.default, callback = el => el) {
        return content == '' ? this.props.default : callback(content)
        // console.log(content); // return callback(content)
    }

    openFiltersPanel(e) {
        e.preventDefault()
        // console.log('You click by this class type: ' + this.type);
        document.querySelector(`[data-filterpanel=${this.type}]`).classList.add('open')
    }

    resetFiltersPanel(e) {
        e.preventDefault()
        e.stopImmediatePropagation() // IMPORTANT
        Object.keys(this.subtype).map(typeKey => {
            console.log(typeKey);
            this.state.search[typeKey] = []
        })
        this.registerChoice('', this.state.search)
    }

    getHtmlJson() {
        const { tagName, filterAPIKey, filterTitleDesktop } = this.props
        const { baseStyleClass, selectedStyleClass, disabledStyleClass, valorisedStyleClass, contentContainer } = this.config
        const { label, valorised } = this.state // console.log(baseStyleClass);
        return {
            tagName: tagName,
            attrs: {
                id: baseStyleClass + '-' + filterAPIKey,
                class: baseStyleClass + ' ' + baseStyleClass + "-filters__action " + filterAPIKey + (valorised ? " " + valorisedStyleClass : ""),
                // filterTagKey: filterTagKey,
            },
            props: {
                onclick: this.openFiltersPanel.bind(this), //  this.routing.onOpenPanel
            },
            children: [
                {
                    attrs: {
                        class: contentContainer,
                    },
                    content: this.getDefault(label), // 'function' == typeof this.transformContent ? this.transformContent() : filterTitleDesktop,
                },
                {
                    attrs: {
                        class: baseStyleClass + ' ' + baseStyleClass + "-filters__action-reset " + filterAPIKey,
                    },
                    props: {
                        onclick: this.resetFiltersPanel.bind(this), //  this.routing.onOpenPanel
                    },
                }
            ]
        }
        // return {}
    }

    /**
     * AUX
     */
    generateSrcStringParam(elArray) {
        let filter = ''
        if (Array.isArray(elArray)) {
            filter += elArray.reduce((prev, curr) => {
                // console.log(prev, curr);
                return prev + ',' + curr

            }, '')
            // console.log(filter.slice(1, filter.length));
            return filter.slice(1, filter.length)
        } else {
            return filter
        }
    }

    /**
     * EQUALITY
     */
    arrayEquals(a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]);
    }
}

export default Filter