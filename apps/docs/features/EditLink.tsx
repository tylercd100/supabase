import { ChevronsUpDown, ExternalLink } from 'lucide-react'
import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  Button,
  Command_Shadcn_,
  CommandEmpty_Shadcn_,
  CommandGroup_Shadcn_,
  CommandItem_Shadcn_,
  CommandInput_Shadcn_,
  CommandList_Shadcn_,
  Popover_Shadcn_,
  PopoverContent_Shadcn_,
  PopoverTrigger_Shadcn_,
  ScrollArea,
  cn,
} from 'ui'

interface IEditLink {
  label: string
  href: string
}

const EditLinkContext = createContext<Array<IEditLink> | undefined>(undefined)
const EditLinkSetterContext = createContext<Dispatch<SetStateAction<Array<IEditLink>>> | undefined>(
  undefined
)

const EditLinksProvider = ({ children }: PropsWithChildren) => {
  const [editLinks, setEditLinks] = useState<Array<IEditLink>>([])

  return (
    <EditLinkContext.Provider value={editLinks}>
      <EditLinkSetterContext.Provider value={setEditLinks}>
        {children}
      </EditLinkSetterContext.Provider>
    </EditLinkContext.Provider>
  )
}

const useEditLinks = () => {
  const links = useContext(EditLinkContext)
  return links ?? []
}

const useAddEditLink = (editLink: IEditLink) => {
  const setEditLinks = useContext(EditLinkSetterContext)

  useEffect(() => {
    setEditLinks?.((currLinks) => [...currLinks, editLink])
    return () => setEditLinks?.((currLinks) => currLinks.filter((link) => link !== editLink))
  }, [editLink, setEditLinks])
}

const EditLink = ({ className }: { className?: string }) => {
  const links = useEditLinks()

  return !links.length ? null : links.length === 1 ? (
    <EditLinkSingle className={className} href={links[0].href} />
  ) : (
    <EditLinkSelector className={className} links={links} />
  )
}

const EditLinkSingle = ({ href, className }: { href: string; className?: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer noopener"
    className={cn(
      'text-sm',
      'w-fit',
      'flex items-center gap-1',
      'transition text-scale-1000 hover:text-scale-1200',
      className
    )}
  >
    Edit this page on GitHub <ExternalLink size={14} strokeWidth={1.5} />
  </a>
)

const EditLinkSelector = ({
  links,
  className,
}: {
  links: Array<IEditLink>
  className?: string
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover_Shadcn_ open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger_Shadcn_ asChild>
        <Button
          type="default"
          className={className}
          iconRight={<ChevronsUpDown className="text-foreground-muted" strokeWidth={2} size={14} />}
        >
          Select a section to edit on GitHub
        </Button>
      </PopoverTrigger_Shadcn_>
      <PopoverContent_Shadcn_ className="p-0" side="bottom" align="start" sameWidthAsTrigger>
        <Command_Shadcn_>
          <CommandInput_Shadcn_ placeholder="Find section..." />
          <CommandList_Shadcn_>
            <CommandEmpty_Shadcn_>No sections found</CommandEmpty_Shadcn_>
            <CommandGroup_Shadcn_>
              <ScrollArea className={(links || []).length > 7 ? 'h-[210px]' : ''}>
                {links.map((link) => (
                  <CommandItem_Shadcn_
                    key={link.href}
                    className="cursor-pointer flex items-center justify-between space-x-2 w-full"
                    onSelect={() => {
                      window.open(link.href, '_blank', 'noopener,noreferrer')
                      setOpen(false)
                    }}
                    onClick={() => {
                      window.open(link.href, '_blank', 'noopener,noreferrer')
                      setOpen(false)
                    }}
                  >
                    <span>{link.label}</span>
                  </CommandItem_Shadcn_>
                ))}
              </ScrollArea>
            </CommandGroup_Shadcn_>
          </CommandList_Shadcn_>
        </Command_Shadcn_>
      </PopoverContent_Shadcn_>
    </Popover_Shadcn_>
  )
}

export { EditLink, EditLinkSingle, EditLinksProvider, useAddEditLink }
