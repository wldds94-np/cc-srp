import ccObject from "../abstract/ccObject"

class Filter extends ccObject {
    constructor(props) {
        super(props)
        // this.props = Object.assign(props, {}) // console.log(props);
        this.type = this.saveSafePropertyProps(this.props, 'filterAPIKey')

        this.subType = this.saveSafePropertyProps(this.props, 'subType', [this.type])

        this.props = {
            ...this.props,
            tagName: this.saveSafePropertyProps(this.props, 'tagName', 'button'), // tagName || 'button',
            filterAPIKey: this.type, // filterAPIKey || '',
            filterTagKey: this.saveSafePropertyProps(this.props, 'filterTagKey'), // filterTagKey || '',
            filterTitleDesktop: this.saveSafePropertyProps(this.props, 'filterTitleDesktop'), // filterTitleDesktop || '',
            // The real filter with PLACEHOLDER {{ $i }}
            realFilterTagKey: this.saveSafePropertyProps(this.props, 'realFilterTagKey', false), // filterTagKey || '',
            // selected: props.selected || false
            defaultFilterValue: this.saveSafePropertyProps(this.props, 'defaultFilterValue', this.props.filterTitleDesktop)
        } // console.log(this.state);

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
            labelSeparator: props.hasOwnProperty('labelSeparator') ? props.labelSeparator : ', '
        }

        this.state = {
            label: this.saveSafePropertyProps(this.props, 'label', []), // this.props.defaultFilterValue),
            search: this.saveSafePropertyProps(this.props, 'search', []),
            valorised: this.saveSafePropertyProps(this.props, 'valorised', false),
            // search: this.saveSafePropertyProps(this.props, 'search', ''),
            openPing: false, // Set by Setup after inject HTML in the DOM
        }

        // Set the callbacks Routing
        this.callbacks = {
            Router: {
                pingRequest: this.saveSafePropertyProps(props, 'onSaveChoice', (...args) => { return }),
            },
            // ON RUN
            FilterPanel: {
                onOpenCallback: this.saveSafePropertyProps(props, 'onOpenCallback', (...args) => { return }),
            }
        }

        this.applyTransformContent = content => content

        // console.log('Filter');
        // console.log(this);
    }

    isValorised() {
        const searchKey = Object.keys(this.state.search)
        // console.log(searchKey); // console.log(searchKey);
        const res = Boolean(searchKey.length) && searchKey.reduce((prev, next) => {
            // console.log(this.state.search[next]);
            return prev && Boolean(this.state.search[next].length)
        }, true) // console.log(res);

        return res

    }

    registerChoice(content = [], search = [], sendPing = true/* , subtypeKey = this.type */) {
        console.log(this);
        console.log(content, search);
        // console.log('You clicked ByList with value: ' + search + ' --- Content: ', content); // console.log('RegisterChoice');

        this.state.label = content
        this.state.search = search // console.log(this); // console.log(subtypeKey); // console.log(this.subType) // console.log(this.subType[subtypeKey]);
        this.updatingBeforeInjectContent()

        // I HAVE TO USE A PRE STRUCTURE STRING FOR ANY FILTER - duration / offers ecc.
        // const filterTag = false != this.props.realFilterTagKey ? this.props.realFilterTagKey : this.props.filterTagKey

        if (this.state.openPing && sendPing) {
            let newQueryValues = []
            // console.log(this.subType);
            Object.keys(this.subType).map(typeKey => {
                console.log(typeKey);

                let queryObject = this.subType[typeKey]
                const { filterTagKey, filterTagValue, regex } = queryObject
                // I HAVE TO SEND THE REQUEST WITH THE REGEX
                const newSearchAttachedValue = this.generateSrcStringParam(this.state.search[typeKey])
                newQueryValues.push({
                    queryTag: filterTagKey.replace(regex, newSearchAttachedValue),
                    queryValue: filterTagValue.replace(regex, newSearchAttachedValue),
                    indexTag: this.subType[typeKey].indexTag,
                })
            })
            // console.log(newQueryValues);
            this.callbacks.Router.pingRequest(newQueryValues)
        }
    }

    updateState(newContent = [], newSearch = []) {
        const { label, search } = this.state
        // console.log(this); // console.log(label); console.log(search); console.log(newContent); console.log(newSearch); 
        // console.log(newSearch == search); console.log(label == newContent);

        // RETURN IF IT'S EQUAL - Otherwise -> Loop
        if (this.arrayEquals(newSearch, search) && label == newContent) { // console.log('FILTER LABEL - NOT UPDATE RETURN - Nothing to UPDATE');
            return
        } else { // 
            // console.log('FILTER LABEL - UPDATE RETURN - I have to UPDATE');
            this.registerChoice(newContent, newSearch/* , false */)
        }
    }

    updatingBeforeInjectContent() {
        console.log('Update Content');
        let newContent = ''
        if (this.state.label.length) {
            newContent = this.generateLabelStringContent(this.state.label)
        } else {
            newContent += this.getDefault() // this.state.defaultFilterValueContent // this.state.filterTitleDesktop
        }
        this.injectContent(this.applyTransformContent(newContent))

        this.updateValorised()

    }

    updateValorised() {
        const { valorisedStyleClass, domInstanceSelector } = this.config
        // console.log('Set Content');
        let thisButton = this.getDomInstance(domInstanceSelector)
        this.state.valorised = Boolean(this.isValorised()) ? true : false
        if (null != thisButton) {
            // console.log(thisButton);
            if (this.state.valorised) { // CHECK IF CLASS IS CONTAIN ??
                thisButton.classList.add(valorisedStyleClass)
            } else {
                thisButton.classList.remove(valorisedStyleClass)
            }
        }

    }

    injectContent(newContent) {
        const { contentContainerSelector, domInstanceSelector } = this.config // console.log('Set Content');
        let thisButton = this.getDomInstance(domInstanceSelector) // console.log(thisButton);
        let contentNode = null != thisButton ? thisButton.querySelector(contentContainerSelector) : null // console.log(contentNode); // console.log(contentContainer); // contentContainer.textContent = newContent
        // on Start non è nel DOM
        if (null != contentNode) {
            contentNode.textContent = newContent
        }
    }

    getDefault(content = this.props.defaultFilterValue, callback = el => el) {
        return content == '' ? this.props.defaultFilterValue : callback(content)
        // console.log(content); // return callback(content)
    }

    openFiltersPanel(e) {
        e.preventDefault()
        // console.log('You click by this class type: ' + this.type);
        document.querySelector(`[data-filterpanel=${this.type}]`).classList.add('open')

        this.callbacks.FilterPanel.onOpenCallback(/* this.state.search */)
    }

    resetFiltersPanel(e) {
        e.preventDefault()
        e.stopImmediatePropagation() // IMPORTANT
        Object.keys(this.subType).map(typeKey => {
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
                    content: this.getDefault(this.generateLabelStringContent(label)), // 'function' == typeof this.transformContent ? this.transformContent() : filterTitleDesktop,
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

    generateLabelStringContent(elArray = this.state.label) {
        const { hasCounter, labelSeparator } = this.config
        let filterContent = ''
        if (elArray.length) {
            if (hasCounter) {
                // console.log('Has Counter');
                let count = 0
                elArray.map(value => {
                    filterContent += count > 0 ? '' : value
                    count++
                })
                filterContent += count - 1 > 0 ? ' (+' + (count - 1) + ')' : ''
            } else {
                // console.log('Not Has Counter');
                filterContent += elArray.reduce((prev, curr) => {
                    // console.log(prev, curr);
                    return prev + labelSeparator + curr

                }, '')
                return filterContent.slice(labelSeparator.length, filterContent.length)
            }
        }
        return filterContent

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