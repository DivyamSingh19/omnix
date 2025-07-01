import { Collapsible,CollapsibleTrigger,CollapsibleContent } from "@radix-ui/react-collapsible"
import { ChevronDown } from "lucide-react"
import { SidebarGroup,SidebarGroupLabel,SidebarGroupContent } from "../ui/sidebar"

export function AppSidebar() {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            Help
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent />
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}